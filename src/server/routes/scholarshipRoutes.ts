import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// GET active/all scholarships with comprehensive filtering
router.get('/', (req: Request, res: Response) => {
  const { search, homeState, studyState, course, category, maxIncome, status, type } = req.query;

  let results = [...db.scholarships];

  // Filter by status (default to Active unless status='all' is requested)
  if (status && status !== 'all') {
    results = results.filter((s) => s.status.toLowerCase() === String(status).toLowerCase());
  } else if (!status) {
    results = results.filter((s) => s.status === 'Active');
  }

  // Filter by Home State eligibility
  if (homeState) {
    const hs = String(homeState).toLowerCase();
    results = results.filter(
      (s) => s.homeStates.length === 0 || s.homeStates.some((st) => st.toLowerCase() === hs)
    );
  }

  // Filter by Study State eligibility
  if (studyState) {
    const ss = String(studyState).toLowerCase();
    results = results.filter(
      (s) => s.studyStates.length === 0 || s.studyStates.some((st) => st.toLowerCase() === ss)
    );
  }

  // Filter by Course
  if (course) {
    const c = String(course).toLowerCase();
    results = results.filter(
      (s) => s.courses.length === 0 || s.courses.some((cr) => cr.toLowerCase().includes(c) || c.includes(cr.toLowerCase()))
    );
  }

  // Filter by Category
  if (category) {
    const cat = String(category).toLowerCase();
    results = results.filter(
      (s) => s.categories.length === 0 || s.categories.some((cg) => cg.toLowerCase() === cat)
    );
  }

  // Filter by Income
  if (maxIncome) {
    const income = Number(maxIncome);
    if (!isNaN(income)) {
      results = results.filter((s) => !s.maxIncome || s.maxIncome >= income);
    }
  }

  // Filter by Type
  if (type) {
    results = results.filter((s) => s.type.toLowerCase() === String(type).toLowerCase());
  }

  // Search string query
  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    total: results.length,
    scholarships: results,
  });
});

// GET scholarship by ID
router.get('/:id', (req: Request, res: Response) => {
  const scholarship = db.scholarships.find((s) => s.id === req.params.id);
  if (!scholarship) {
    return res.status(404).json({ success: false, message: 'Scholarship not found.' });
  }
  return res.json({ success: true, scholarship });
});

// POST Add new scholarship (Admin/Government)
router.post('/', authenticateToken, requireRole('admin', 'government'), (req: AuthRequest, res: Response) => {
  try {
    const { name, provider, type, description, eligibility, homeStates, studyStates, courses, categories, maxIncome, minAcademicMarks, requiredDocuments, deadline, amount, applicationLink } = req.body;

    if (!name || !provider || !amount) {
      return res.status(400).json({ success: false, message: 'Scholarship name, provider, and amount are required.' });
    }

    const newSch = {
      id: 'sch_' + Date.now(),
      name,
      provider,
      type: type || 'State Government',
      description: description || '',
      eligibility: eligibility || 'Eligible students as per scheme guidelines',
      homeStates: Array.isArray(homeStates) ? homeStates : [],
      studyStates: Array.isArray(studyStates) ? studyStates : [],
      courses: Array.isArray(courses) ? courses : ['B.Tech', 'B.Sc', 'M.Tech', 'Diploma'],
      categories: Array.isArray(categories) ? categories : ['General', 'OBC', 'SC', 'ST'],
      maxIncome: Number(maxIncome) || 500000,
      minAcademicMarks: Number(minAcademicMarks) || 60,
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : ['Aadhaar', 'Bonafide Certificate', 'Income Certificate'],
      deadline: deadline || '2026-12-31',
      amount: Number(amount),
      applicationLink: applicationLink || '',
      status: 'Active',
    };

    db.scholarships.push(newSch);
    logAuditAction(req, 'ADD_SCHOLARSHIP', 'Scholarship', newSch.id, `Added scholarship ${newSch.name}`);

    return res.json({ success: true, message: 'Scholarship created successfully!', scholarship: newSch });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error adding scholarship.' });
  }
});

// PUT Update scholarship
router.put('/:id', authenticateToken, requireRole('admin', 'government'), (req: AuthRequest, res: Response) => {
  const sch = db.scholarships.find((s) => s.id === req.params.id);
  if (!sch) {
    return res.status(404).json({ success: false, message: 'Scholarship not found.' });
  }

  Object.assign(sch, req.body);
  logAuditAction(req, 'UPDATE_SCHOLARSHIP', 'Scholarship', sch.id, `Updated scholarship ${sch.name}`);

  return res.json({ success: true, message: 'Scholarship updated.', scholarship: sch });
});

// DELETE scholarship
router.delete('/:id', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
  const index = db.scholarships.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Scholarship not found.' });
  }

  db.scholarships.splice(index, 1);
  logAuditAction(req, 'DELETE_SCHOLARSHIP', 'Scholarship', req.params.id, 'Deleted scholarship');

  return res.json({ success: true, message: 'Scholarship deleted.' });
});

export default router;
