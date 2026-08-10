import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { authenticateToken, JWT_SECRET, AuthRequest, logAuditAction } from '../middleware/auth.js';

const router = Router();

// Register new account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, state, institutionId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now();

    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash: hashedPassword,
      role: role || 'student',
      state: state || 'Gujarat',
      institutionId: institutionId || '',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);

    // If student, create empty profile
    if (role === 'student') {
      db.profiles.push({
        userId,
        homeState: state || 'Gujarat',
        studyState: '',
        institutionId: '',
        institutionName: '',
        course: '',
        enrollmentNumber: '',
        academicYear: '',
        category: 'General',
        familyIncome: 0,
        isVerified: false,
      });
    }

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    logAuditAction(
      { user: newUser } as any,
      'USER_REGISTERED',
      'User',
      newUser.id,
      `Registered as ${newUser.role}`
    );

    const { passwordHash, ...userWithoutPassword } = newUser;
    return res.json({
      success: true,
      message: 'Registration successful!',
      token,
      user: userWithoutPassword,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Contact administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    logAuditAction({ user } as any, 'USER_LOGIN', 'User', user.id, `Logged in successfully`);

    const { passwordHash, ...userWithoutPassword } = user;
    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: userWithoutPassword,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Demo Persona Quick Login
router.post('/demo-login', async (req, res) => {
  try {
    const { role, state } = req.body;

    let targetEmail = 'student@scholarsetu.in'; // default student
    if (role === 'institution') targetEmail = 'coep.nodal@coep.ac.in';
    else if (role === 'government') {
      if (state === 'Maharashtra') targetEmail = 'admin.maharashtra@scholarships.gov.in';
      else targetEmail = 'admin.gujarat@scholarships.gov.in';
    } else if (role === 'admin') targetEmail = 'admin@scholarsetu.in';

    const user = db.users.find((u) => u.email === targetEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo account not found.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    logAuditAction({ user } as any, 'DEMO_LOGIN', 'User', user.id, `Demo login as ${user.role}`);

    const { passwordHash, ...userWithoutPassword } = user;
    return res.json({
      success: true,
      message: `Demo login successful as ${user.name}!`,
      token,
      user: userWithoutPassword,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Demo login error.' });
  }
});

// Current User Profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const { passwordHash, ...userWithoutPassword } = req.user;
  let profile = null;
  if (req.user.role === 'student') {
    profile = db.profiles.find((p) => p.userId === req.user.id);
  }
  let institution = null;
  if (req.user.role === 'institution' && req.user.institutionId) {
    institution = db.institutions.find((i) => i.id === req.user.institutionId);
  }

  return res.json({
    success: true,
    user: userWithoutPassword,
    profile,
    institution,
  });
});

export default router;
