import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// System Statistics (Role-aware: Super Admin gets full system view, State Govt gets jurisdiction stats)
router.get('/statistics', authenticateToken, requireRole('admin', 'government'), (req: AuthRequest, res: Response) => {
  const user = req.user;

  let apps = [...db.applications];
  if (user.role === 'government' && user.state) {
    apps = apps.filter(
      (a) => a.homeState.toLowerCase() === user.state.toLowerCase() || a.studyState.toLowerCase() === user.state.toLowerCase()
    );
  }

  const totalCollectedFees = db.payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = {
    totalStudents: db.users.filter((u) => u.role === 'student').length,
    totalInstitutions: db.institutions.length,
    totalScholarships: db.scholarships.length,
    totalApplications: apps.length,
    pendingVerifications: apps.filter(
      (a) => a.status === 'Institution Verification Pending' || a.status === 'Government Verification Pending'
    ).length,
    approvedApplications: apps.filter((a) => a.status === 'Approved').length,
    rejectedApplications: apps.filter((a) => a.status === 'Rejected' || a.status === 'Institution Rejected').length,
    totalCollectedFees,
    applicationFee: db.settings.application_fee || 150,
  };

  return res.json({ success: true, statistics: stats });
});

// All Applications with Advanced Search & Filter (Super Admin / State Admin)
router.get('/applications', authenticateToken, requireRole('admin', 'government'), (req: AuthRequest, res: Response) => {
  const user = req.user;
  let apps = [...db.applications];

  if (user.role === 'government' && user.state) {
    apps = apps.filter(
      (a) => a.homeState.toLowerCase() === user.state.toLowerCase() || a.studyState.toLowerCase() === user.state.toLowerCase()
    );
  }

  return res.json({ success: true, total: apps.length, applications: apps });
});

// Audit Logs
router.get('/audit-logs', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
  return res.json({ success: true, total: db.auditLogs.length, auditLogs: db.auditLogs });
});

// GET & UPDATE Application Processing Fee
router.get('/fee', (req, res) => {
  return res.json({ success: true, fee: db.settings.application_fee || 150 });
});

router.put('/fee', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
  const { fee } = req.body;
  const numFee = Number(fee);
  if (isNaN(numFee) || numFee < 0) {
    return res.status(400).json({ success: false, message: 'Invalid fee amount.' });
  }

  db.settings.application_fee = numFee;
  logAuditAction(req, 'UPDATE_FEE', 'SystemSetting', 'application_fee', `Updated student fee to ₹${numFee}`);

  return res.json({ success: true, message: `Application processing fee updated to ₹${numFee}`, fee: numFee });
});

// User Account Status Management (Suspend / Activate)
router.put('/users/:id/status', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
  const targetUser = db.users.find((u) => u.id === req.params.id);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const { status } = req.body;
  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be active or suspended.' });
  }

  targetUser.status = status;
  logAuditAction(req, 'CHANGE_USER_STATUS', 'User', targetUser.id, `Set status to ${status}`);

  return res.json({ success: true, message: `User ${targetUser.name} status set to ${status}.`, user: targetUser });
});

// GET All Users for Super Admin
router.get('/users', authenticateToken, requireRole('admin'), (req: AuthRequest, res: Response) => {
  const userList = db.users.map(({ passwordHash, ...u }) => u);
  return res.json({ success: true, users: userList });
});

export default router;
