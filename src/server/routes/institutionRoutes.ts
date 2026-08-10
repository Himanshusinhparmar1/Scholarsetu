import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// GET all colleges with search & filter
router.get('/', (req: Request, res: Response) => {
  const { search, state, district, type, affiliation } = req.query;

  let results = [...db.institutions];

  if (state) {
    results = results.filter((i) => i.state.toLowerCase() === String(state).toLowerCase());
  }

  if (district) {
    results = results.filter((i) => i.district.toLowerCase() === String(district).toLowerCase());
  }

  if (type) {
    results = results.filter((i) => i.type.toLowerCase() === String(type).toLowerCase());
  }

  if (affiliation) {
    results = results.filter((i) => i.affiliation.toLowerCase().includes(String(affiliation).toLowerCase()));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.state.toLowerCase().includes(q) ||
        i.institutionCode.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    total: results.length,
    institutions: results,
  });
});

// GET single institution
router.get('/:id', (req: Request, res: Response) => {
  const inst = db.institutions.find((i) => i.id === req.params.id);
  if (!inst) {
    return res.status(404).json({ success: false, message: 'Institution not found.' });
  }
  return res.json({ success: true, institution: inst });
});

// POST register or request onboarding for new institution (Free of charge!)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, type, state, district, city, address, affiliation, institutionCode, contactEmail, contactPhone, nodalOfficerName } = req.body;

    if (!name || !state || !type) {
      return res.status(400).json({ success: false, message: 'Institution name, type, and state are required.' });
    }

    const instId = 'inst_' + Date.now();
    const newInst = {
      id: instId,
      name,
      type: type || 'College',
      state,
      district: district || city || 'General',
      city: city || 'General',
      address: address || '',
      affiliation: affiliation || 'Recognized Board/University',
      institutionCode: institutionCode || `IN-${state.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationStatus: 'verified', // Free self-registration for institutions
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      nodalOfficerName: nodalOfficerName || 'Authorized Registrar',
    };

    db.institutions.push(newInst);

    return res.json({
      success: true,
      message: 'Institution onboarded successfully! Zero registration fee charged.',
      institution: newInst,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error onboarding institution.' });
  }
});

// UPDATE institution
router.put('/:id', authenticateToken, requireRole('institution', 'admin'), (req: AuthRequest, res: Response) => {
  const inst = db.institutions.find((i) => i.id === req.params.id);
  if (!inst) {
    return res.status(404).json({ success: false, message: 'Institution not found.' });
  }

  if (req.user.role === 'institution' && req.user.institutionId !== inst.id) {
    return res.status(403).json({ success: false, message: 'You can only update your own institution profile.' });
  }

  Object.assign(inst, req.body);
  logAuditAction(req, 'UPDATE_INSTITUTION', 'Institution', inst.id, `Updated profile for ${inst.name}`);

  return res.json({ success: true, message: 'Institution updated.', institution: inst });
});

export default router;
