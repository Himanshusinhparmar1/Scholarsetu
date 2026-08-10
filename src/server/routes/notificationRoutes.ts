import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET User Notifications
router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  const userNotifs = db.notifications.filter((n) => n.userId === req.user.id);
  return res.json({ success: true, notifications: userNotifs });
});

// Mark Notification as Read
router.put('/:id/read', authenticateToken, (req: AuthRequest, res: Response) => {
  const notif = db.notifications.find((n) => n.id === req.params.id && n.userId === req.user.id);
  if (notif) {
    notif.read = true;
  }
  return res.json({ success: true });
});

export default router;
