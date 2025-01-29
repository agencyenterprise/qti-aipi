import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { randomBytes } from 'crypto';

const router = express.Router();

// Create a new class (teachers only)
router.post(
  '/',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('name').trim().notEmpty(),
    body('description').optional().trim()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;
      const code = randomBytes(3).toString('hex').toUpperCase();

      const newClass = await prisma.class.create({
        data: {
          name,
          description,
          code,
          teacherId: req.user!.id
        },
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      res.status(201).json(newClass);
    } catch (error) {
      console.error('Create class error:', error);
      res.status(500).json({ message: 'Error creating class' });
    }
  }
);

// Get all classes for a teacher
router.get('/teaching', authenticateToken, authorizeRole('TEACHER'), async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      where: {
        teacherId: req.user!.id
      },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

// Get all classes for a student
router.get('/enrolled', authenticateToken, authorizeRole('STUDENT'), async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: req.user!.id
      },
      include: {
        class: {
          include: {
            teacher: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json(enrollments.map(enrollment => enrollment.class));
  } catch (error) {
    console.error('Get enrolled classes error:', error);
    res.status(500).json({ message: 'Error fetching enrolled classes' });
  }
});

// Join a class (students only)
router.post(
  '/join',
  authenticateToken,
  authorizeRole('STUDENT'),
  [
    body('code').trim().notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { code } = req.body;

      const classToJoin = await prisma.class.findUnique({
        where: { code }
      });

      if (!classToJoin) {
        return res.status(404).json({ message: 'Class not found' });
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          classId_studentId: {
            classId: classToJoin.id,
            studentId: req.user!.id
          }
        }
      });

      if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this class' });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          classId: classToJoin.id,
          studentId: req.user!.id
        },
        include: {
          class: true
        }
      });

      res.status(201).json(enrollment);
    } catch (error) {
      console.error('Join class error:', error);
      res.status(500).json({ message: 'Error joining class' });
    }
  }
);

// Get class details
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const classDetails = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        enrollments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if user has access to this class
    if (
      classDetails.teacherId !== req.user!.id &&
      !classDetails.enrollments.some(e => e.student.id === req.user!.id)
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(classDetails);
  } catch (error) {
    console.error('Get class details error:', error);
    res.status(500).json({ message: 'Error fetching class details' });
  }
});

export default router; 