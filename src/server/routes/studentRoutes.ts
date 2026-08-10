import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// GET Student Profile
router.get('/profile', authenticateToken, requireRole('student'), (req: AuthRequest, res: Response) => {
  let profile = db.profiles.find((p) => p.userId === req.user.id);
  if (!profile) {
    profile = {
      userId: req.user.id,
      homeState: req.user.state || 'Gujarat',
      studyState: '',
      institutionId: '',
      institutionName: '',
      course: '',
      enrollmentNumber: '',
      academicYear: '',
      category: 'General',
      familyIncome: 0,
      isVerified: false,
    };
    db.profiles.push(profile);
  }

  // Get institution name if institutionId is set
  if (profile.institutionId && !profile.institutionName) {
    const inst = db.institutions.find((i) => i.id === profile.institutionId);
    if (inst) profile.institutionName = inst.name;
  }

  return res.json({ success: true, profile });
});

// UPDATE Student Profile
router.put('/profile', authenticateToken, requireRole('student'), (req: AuthRequest, res: Response) => {
  const { homeState, studyState, institutionId, course, enrollmentNumber, academicYear, category, familyIncome, aadhaarNumber, bankAccount } = req.body;

  let profile = db.profiles.find((p) => p.userId === req.user.id);
  const inst = db.institutions.find((i) => i.id === institutionId);

  if (!profile) {
    profile = {
      userId: req.user.id,
      homeState,
      studyState,
      institutionId,
      institutionName: inst ? inst.name : '',
      course,
      enrollmentNumber,
      academicYear,
      category,
      familyIncome: Number(familyIncome) || 0,
      aadhaarNumber,
      bankAccount,
      isVerified: false,
    };
    db.profiles.push(profile);
  } else {
    profile.homeState = homeState || profile.homeState;
    profile.studyState = studyState || profile.studyState;
    profile.institutionId = institutionId || profile.institutionId;
    profile.institutionName = inst ? inst.name : profile.institutionName;
    profile.course = course || profile.course;
    profile.enrollmentNumber = enrollmentNumber || profile.enrollmentNumber;
    profile.academicYear = academicYear || profile.academicYear;
    profile.category = category || profile.category;
    profile.familyIncome = familyIncome !== undefined ? Number(familyIncome) : profile.familyIncome;
    if (aadhaarNumber) profile.aadhaarNumber = aadhaarNumber;
    if (bankAccount) profile.bankAccount = bankAccount;
  }

  logAuditAction(req, 'UPDATE_PROFILE', 'StudentProfile', req.user.id, 'Updated student profile details');

  return res.json({ success: true, message: 'Profile updated successfully!', profile });
});

export default router;
