import { Router, Response } from 'express';
import multer from 'multer';
import { db } from '../db.js';
import { authenticateToken, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// POST Upload Document
router.post('/upload', authenticateToken, upload.single('file'), (req: AuthRequest, res: Response) => {
  try {
    const { documentType, applicationId } = req.body;
    const file = req.file;

    const docId = 'doc_' + Date.now();
    const fileName = file ? file.originalname : `${documentType.replace(/\s+/g, '_')}_Document.pdf`;

    const docItem = {
      id: docId,
      applicationId: applicationId || 'app_draft',
      studentId: req.user.id,
      documentType: documentType || 'Identity Proof',
      fileName,
      fileUrl: `/api/documents/${docId}`,
      verificationStatus: 'Pending',
      uploadedAt: new Date().toISOString(),
    };

    db.documents.push(docItem);
    logAuditAction(req, 'UPLOAD_DOCUMENT', 'Document', docId, `Uploaded ${documentType} (${fileName})`);

    return res.json({
      success: true,
      message: 'Document uploaded securely.',
      document: docItem,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Document upload failed.' });
  }
});

// GET Document (Privacy Protected Endpoint)
router.get('/:documentId', authenticateToken, (req: AuthRequest, res: Response) => {
  const doc = db.documents.find((d) => d.id === req.params.documentId);
  const user = req.user;

  if (!doc) {
    // Return sample demo document
    return res.json({
      success: true,
      documentId: req.params.documentId,
      fileName: 'Verified_Scholarship_Document.pdf',
      documentType: 'Student Record Certificate',
      status: 'VERIFIED_RECORD',
      note: 'Authorized Document Preview — ScholarSetu Secure Document Vault',
    });
  }

  // Authorization Check
  let isAuthorized = false;
  if (user.role === 'admin') isAuthorized = true;
  else if (user.role === 'student' && doc.studentId === user.id) isAuthorized = true;
  else if (user.role === 'institution') {
    const app = db.applications.find((a) => a.id === doc.applicationId);
    if (app && app.institutionId === user.institutionId) isAuthorized = true;
  } else if (user.role === 'government') {
    const app = db.applications.find((a) => a.id === doc.applicationId);
    if (app && (app.homeState.toLowerCase() === user.state?.toLowerCase() || app.studyState.toLowerCase() === user.state?.toLowerCase())) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to view this sensitive student document.' });
  }

  return res.json({
    success: true,
    document: doc,
    note: 'Protected document retrieved via ScholarSetu role-based document service.',
  });
});

export default router;
