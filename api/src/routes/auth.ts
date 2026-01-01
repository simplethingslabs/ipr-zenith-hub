import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { generateToken } from '../utils/jwt';
import { validate } from '../middleware/validate';
import { loginSchema, LoginInput } from '../validators/auth';

const router = Router();

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Return token and user info (without password)
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
