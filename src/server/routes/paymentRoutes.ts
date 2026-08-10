import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// Create Payment Order for Student (Fee applies ONLY to students = default ₹150)
router.post('/create', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.body;

    if (req.user.role !== 'student') {
      return res.json({
        success: true,
        amount: 0,
        message: 'No fee applicable for institutions or state government authorities.',
      });
    }

    const app = db.applications.find((a) => a.id === applicationId);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (app.studentId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized application access.' });
    }

    const currentFee = db.settings.application_fee || 150;
    const orderId = 'ORD_SETU_' + Date.now();

    return res.json({
      success: true,
      orderId,
      applicationId: app.id,
      applicationNumber: app.applicationNumber,
      amount: currentFee,
      currency: 'INR',
      merchantName: 'ScholarSetu Central Processing Gateway',
      note: 'Nominal student application processing fee for cross-state verification',
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Payment initialization error.' });
  }
});

// Verify Payment
router.post('/verify', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { applicationId, orderId, paymentMethod, transactionId } = req.body;

    const app = db.applications.find((a) => a.id === applicationId);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const currentFee = db.settings.application_fee || 150;
    const txnId = transactionId || 'TXN_SETU_' + Date.now();

    const paymentRecord = {
      id: 'pay_' + Date.now(),
      applicationId: app.id,
      studentId: req.user.id,
      amount: currentFee,
      status: 'Paid',
      transactionId: txnId,
      paymentMethod: paymentMethod || 'UPI / NetBanking Sandbox',
      createdAt: new Date().toISOString(),
    };

    db.payments.push(paymentRecord);

    // Update application status from Payment Pending -> Institution Verification Pending!
    app.paymentStatus = 'Paid';
    app.status = 'Institution Verification Pending';
    app.updatedAt = new Date().toISOString();

    // Create Notification for Student
    db.notifications.unshift({
      id: 'notif_' + Date.now(),
      userId: req.user.id,
      title: 'Payment Successful! ₹' + currentFee,
      message: `Payment of ₹${currentFee} (Txn: ${txnId}) received. Application #${app.applicationNumber} sent to ${app.institutionName} for verification.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Create Notification for Institution Officer
    const instOfficer = db.users.find(
      (u) => u.role === 'institution' && u.institutionId === app.institutionId
    );
    if (instOfficer) {
      db.notifications.unshift({
        id: 'notif_' + Date.now(),
        userId: instOfficer.id,
        title: 'New Verification Request Pending',
        message: `Student ${app.studentName} (${app.enrollmentNumber}) from ${app.homeState} submitted verification request for ${app.scholarshipName}.`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    logAuditAction(req, 'PAYMENT_COMPLETED', 'Payment', paymentRecord.id, `Paid ₹${currentFee} for ${app.applicationNumber}`);

    return res.json({
      success: true,
      message: `Payment of ₹${currentFee} completed successfully!`,
      payment: paymentRecord,
      application: app,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Payment verification failed.' });
  }
});

// GET Payment details for application
router.get('/:applicationId', authenticateToken, (req: AuthRequest, res: Response) => {
  const pay = db.payments.find((p) => p.applicationId === req.params.applicationId);
  return res.json({ success: true, payment: pay || null, defaultFee: db.settings.application_fee || 150 });
});

export default router;
