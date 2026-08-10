import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// GET Applications (Strict Role & State Based Security)
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const { status, homeState, studyState, institutionId, search } = req.query;
  const user = req.user;

  let results = [...db.applications];

  // Role Security Scoping:
  if (user.role === 'student') {
    results = results.filter((app) => app.studentId === user.id);
  } else if (user.role === 'institution') {
    // Institutions MUST ONLY see students applying to their institution
    if (!user.institutionId) {
      return res.status(403).json({ success: false, message: 'No institution linked to your account.' });
    }
    results = results.filter((app) => app.institutionId === user.institutionId);
  } else if (user.role === 'government') {
    // State Government Admins MUST ONLY see applications belonging to their state jurisdiction
    if (!user.state) {
      return res.status(403).json({ success: false, message: 'No jurisdiction state configured for admin.' });
    }
    results = results.filter(
      (app) => app.homeState.toLowerCase() === user.state.toLowerCase() || app.studyState.toLowerCase() === user.state.toLowerCase()
    );
  } // Admin sees all

  // Apply optional query filters
  if (status) {
    results = results.filter((app) => app.status.toLowerCase() === String(status).toLowerCase());
  }

  if (homeState) {
    results = results.filter((app) => app.homeState.toLowerCase() === String(homeState).toLowerCase());
  }

  if (studyState) {
    results = results.filter((app) => app.studyState.toLowerCase() === String(studyState).toLowerCase());
  }

  if (institutionId) {
    results = results.filter((app) => app.institutionId === String(institutionId));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (app) =>
        app.applicationNumber.toLowerCase().includes(q) ||
        app.studentName.toLowerCase().includes(q) ||
        app.scholarshipName.toLowerCase().includes(q) ||
        app.institutionName.toLowerCase().includes(q)
    );
  }

  return res.json({
    success: true,
    total: results.length,
    applications: results,
  });
});

// GET Single Application with Privacy Enforcement
router.get('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user;
  const app = db.applications.find((a) => a.id === req.params.id || a.applicationNumber === req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  // Authorization Check
  if (user.role === 'student' && app.studentId !== user.id) {
    return res.status(403).json({ success: false, message: 'You do not have permission to access this application.' });
  }
  if (user.role === 'institution' && app.institutionId !== user.institutionId) {
    return res.status(403).json({ success: false, message: 'This application does not belong to your institution.' });
  }
  if (user.role === 'government' && app.homeState.toLowerCase() !== user.state?.toLowerCase() && app.studyState.toLowerCase() !== user.state?.toLowerCase()) {
    return res.status(403).json({ success: false, message: 'You do not have administrative authority over this State jurisdiction.' });
  }

  return res.json({ success: true, application: app });
});

// POST Create new Application
router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { scholarshipId, institutionId, homeState, studyState, course, enrollmentNumber, academicYear, category, familyIncome, documents } = req.body;

    if (!scholarshipId || !institutionId || !homeState || !studyState || !course || !enrollmentNumber) {
      return res.status(400).json({ success: false, message: 'Please provide all required application details.' });
    }

    const scholarship = db.scholarships.find((s) => s.id === scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found.' });
    }

    const institution = db.institutions.find((i) => i.id === institutionId);
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Selected institution not found.' });
    }

    const appCount = db.applications.length + 101;
    const appId = 'app_' + Date.now();
    const appNum = `SS-2026-${String(appCount).padStart(6, '0')}`;

    const newApp = {
      id: appId,
      applicationNumber: appNum,
      studentId: req.user.id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentPhone: req.user.phone || '+91 9876543210',
      scholarshipId: scholarship.id,
      scholarshipName: scholarship.name,
      provider: scholarship.provider,
      amount: scholarship.amount,
      institutionId: institution.id,
      institutionName: institution.name,
      homeState,
      studyState,
      course,
      enrollmentNumber,
      academicYear: academicYear || 'Current Year',
      category: category || 'General',
      familyIncome: Number(familyIncome) || 0,
      status: 'Payment Pending', // Requires ₹150 student processing fee
      paymentStatus: 'Pending',
      institutionVerificationStatus: 'Pending',
      governmentVerificationStatus: 'Pending',
      documents: Array.isArray(documents) ? documents : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.applications.push(newApp);

    // Create Notification
    db.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: req.user.id,
      title: 'Application Created',
      message: `Application ${appNum} generated for ${scholarship.name}. Please complete the ₹150 processing fee payment to proceed with verification.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });

    logAuditAction(req, 'CREATE_APPLICATION', 'Application', appId, `Created application ${appNum}`);

    return res.json({
      success: true,
      message: 'Application draft created! Please complete ₹150 fee payment to submit.',
      application: newApp,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating application.' });
  }
});

// PUT Update Application Status (Withdraw / Government Action)
router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = req.user;
  const app = db.applications.find((a) => a.id === req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  const { action, rejectionReason, correctionRemarks, status } = req.body;

  // Student Withdraw
  if (action === 'withdraw') {
    if (app.studentId !== user.id) {
      return res.status(403).json({ success: false, message: 'Only the applicant can withdraw this application.' });
    }
    app.status = 'Withdrawn';
    app.updatedAt = new Date().toISOString();
    logAuditAction(req, 'WITHDRAW_APPLICATION', 'Application', app.id, 'Student withdrew application');
    return res.json({ success: true, message: 'Application withdrawn successfully.', application: app });
  }

  // State Government Approval / Rejection / Correction Request
  if (user.role === 'government' || user.role === 'admin') {
    if (user.role === 'government' && app.homeState.toLowerCase() !== user.state?.toLowerCase() && app.studyState.toLowerCase() !== user.state?.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'State jurisdiction unauthorized.' });
    }

    if (action === 'approve') {
      app.status = 'Approved';
      app.governmentVerificationStatus = 'Approved';
      app.updatedAt = new Date().toISOString();

      // Notify Student
      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: app.studentId,
        title: 'Scholarship Approved! 🎉',
        message: `Congratulations! Your scholarship application #${app.applicationNumber} for ${app.scholarshipName} has been approved by Government Authority of ${user.state}.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
      });
    } else if (action === 'reject') {
      app.status = 'Rejected';
      app.governmentVerificationStatus = 'Rejected';
      app.rejectionReason = rejectionReason || 'Failed State scholarship policy verification criteria.';
      app.updatedAt = new Date().toISOString();

      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: app.studentId,
        title: 'Application Update: Rejected',
        message: `Your scholarship application #${app.applicationNumber} was rejected by Government Admin. Reason: ${app.rejectionReason}`,
        type: 'error',
        read: false,
        createdAt: new Date().toISOString(),
      });
    } else if (action === 'request_correction') {
      app.status = 'Correction Required';
      app.governmentVerificationStatus = 'Correction Required';
      app.correctionRemarks = correctionRemarks || 'Please upload updated bonafide and income proof.';
      app.updatedAt = new Date().toISOString();

      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: app.studentId,
        title: 'Correction Required',
        message: `Action required for Application #${app.applicationNumber}: ${app.correctionRemarks}`,
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    logAuditAction(req, `GOVT_${action.toUpperCase()}`, 'Application', app.id, `Govt admin executed ${action}`);
    return res.json({ success: true, message: `Application status updated to ${app.status}.`, application: app });
  }

  return res.status(400).json({ success: false, message: 'Invalid status update action.' });
});

export default router;
