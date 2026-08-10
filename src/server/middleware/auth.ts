import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'scholarsetu_jwt_super_secret_key_2026';

export interface AuthRequest extends Request {
  user?: any;
}

// Middleware to authenticate JWT token
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = db.users.find((u) => u.id === decoded.id && u.status === 'active');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User account invalid or suspended.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Session expired or invalid token.' });
  }
}

// Middleware for Role-Based Access Control
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
}

// Audit logger helper
export function logAuditAction(
  req: AuthRequest,
  action: string,
  resource: string,
  resourceId?: string,
  details?: string
) {
  const log = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId: req.user ? req.user.id : 'system_anon',
    userName: req.user ? req.user.name : 'Anonymous User',
    userRole: req.user ? req.user.role : 'guest',
    action,
    resource,
    resourceId: resourceId || '',
    details: details || '',
    ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(log);
}
