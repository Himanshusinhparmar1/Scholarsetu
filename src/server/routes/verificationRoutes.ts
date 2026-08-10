import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, requireRole, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// POST Verify or Reject student enrollment by Institution Nodal Officer
router.post('/', authenticateToken, requireRole('institution', 'admin'), (req: AuthRequest, res: Response) => {
  try {
    const { applicationId, action, remarks } = req.body;

    if (!applicationId || !action) {
      return res.status(400).json({ success: false, message: 'Application ID and action (verify/reject/request_info) are required.' });
    }

    const app = db.applications.find((a) => a.id === applicationId);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Check institution ownership
    if (req.user.role === 'institution' && app.institutionId !== req.user.institutionId) {
      return res.status(403).json({ success: false, message: 'This student application does not belong to your institution.' });
    }

    if (action === 'verify' || action === 'accept') {
      app.institutionVerificationStatus = 'Verified';
      app.status = 'Government Verification Pending';
      app.updatedAt = new Date().toISOString();

      // Log verification
      db.verifications.push({
        id: 'ver_' + Date.now(),
        applicationId: app.id,
        institutionId: app.institutionId,
        verifiedBy: req.user.name,
        verifierRole: 'Institution Officer',
        status: 'Verified',
        remarks: remarks || 'Student enrollment, course & bonafide status confirmed by Institution.',
        verifiedAt: new Date().toISOString(),
      });

      // Notify Student
      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: app.studentId,
        title: 'Institution Verification Completed! ✅',
        message: `${app.institutionName} has verified your enrollment for Application #${app.applicationNumber}. Your application has been forwarded to ${app.homeState} Government Authority for approval.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Notify State Govt Admin
      const govtUser = db.users.find(
        (u) => u.role === 'government' && u.state.toLowerCase() === app.homeState.toLowerCase()
      );
      if (govtUser) {
        db.notifications.unshift({
          id: 'notif_' + Date.now(),
          userId: govtUser.id,
          title: 'New Verified Application Pending Review',
          message: `Application #${app.applicationNumber} from student ${app.studentName} studying in ${app.studyState} was verified by ${app.institutionName} and awaits your review.`,
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      logAuditAction(req, 'INSTITUTION_VERIFY', 'Application', app.id, `Verified student enrollment`);
      return res.json({ success: true, message: 'Student enrollment verified and forwarded to State Government!', application: app });
    } else if (action === 'reject') {
      app.institutionVerificationStatus = 'Rejected';
      app.status = 'Institution Rejected';
      app.rejectionReason = remarks || 'Student enrollment / bonafide records could not be verified.';
      app.updatedAt = new Date().toISOString();

      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: app.studentId,
        title: 'Institution Verification Rejected',
        message: `Your application #${app.applicationNumber} was rejected by ${app.institutionName}. Reason: ${app.rejectionReason}`,
        type: 'error',
        read: false,
        createdAt: new Date().toISOString(),
      });

      logAuditAction(req, 'INSTITUTION_REJECT', 'Application', app.id, `Rejected student enrollment: ${remarks}`);
      return res.json({ success: true, message: 'Application rejected by institution.', application: app });
    } else if (action === 'request_info') {
      app.institutionVerificationStatus = 'Correction Required';
      app.status = 'Correction Required';
      app.correctionRemarks = remarks || 'Please upload updated admission fee receipt / ID card.';
      app.updatedAt = new Date().toISOString();

      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: app.studentId,
        title: 'Institution Requested Additional Info',
        message: `${app.institutionName} requested information for #${app.applicationNumber}: ${app.correctionRemarks}`,
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString(),
      });

      return res.json({ success: true, message: 'Requested correction from student.', application: app });
    }

    return res.status(400).json({ success: false, message: 'Invalid action.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error performing institution verification.' });
  }
});

// GET Verification logs for an application
router.get('/:applicationId', authenticateToken, (req: AuthRequest, res: Response) => {
  const logs = db.verifications.filter((v) => v.applicationId === req.params.applicationId);
  return res.json({ success: true, verifications: logs });
});

export default router;
