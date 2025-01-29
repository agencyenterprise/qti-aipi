import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put(
  '/me',
  authenticateToken,
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email } = req.body;

      // Check if email is already taken
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser && existingUser.id !== req.user?.id) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user?.id },
        data: {
          firstName,
          lastName,
          email
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true
        }
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Error updating user profile' });
    }
  }
);

// Get all users (admin only)
router.get('/', authenticateToken, authorizeRole('TEACHER'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router; 