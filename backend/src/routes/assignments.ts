import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Create a new assignment (teachers only)
router.post(
  '/',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('title').trim().notEmpty(),
    body('instructions').optional().trim(),
    body('dueDate').isISO8601(),
    body('timeLimit').optional().isInt({ min: 1 }),
    body('assessmentId').isString().notEmpty(),
    body('classId').isString().notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, instructions, dueDate, timeLimit, assessmentId, classId } = req.body;

      // Verify class ownership
      const classRecord = await prisma.class.findUnique({
        where: { id: classId }
      });

      if (!classRecord || classRecord.teacherId !== req.user!.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Verify assessment ownership
      const assessment = await prisma.assessment.findUnique({
        where: { id: assessmentId }
      });

      if (!assessment || assessment.creatorId !== req.user!.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const assignment = await prisma.assignment.create({
        data: {
          title,
          instructions,
          dueDate: new Date(dueDate),
          timeLimit,
          assessmentId,
          classId,
          teacherId: req.user!.id
        },
        include: {
          assessment: true,
          class: true
        }
      });

      res.status(201).json(assignment);
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(500).json({ message: 'Error creating assignment' });
    }
  }
);

// Get assignments for a class
router.get('/class/:classId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const classRecord = await prisma.class.findUnique({
      where: { id: req.params.classId },
      include: {
        enrollments: {
          where: {
            studentId: req.user!.id
          }
        }
      }
    });

    if (!classRecord || (classRecord.teacherId !== req.user!.id && classRecord.enrollments.length === 0)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        classId: req.params.classId
      },
      include: {
        assessment: {
          select: {
            id: true,
            title: true,
            _count: {
              select: {
                questions: true
              }
            }
          }
        },
        submissions: req.user!.role === 'STUDENT' ? {
          where: {
            studentId: req.user!.id
          }
        } : undefined
      },
      orderBy: {
        dueDate: 'asc'
      }
    });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// Get assignment details
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id },
      include: {
        assessment: {
          include: {
            questions: true
          }
        },
        class: true,
        submissions: req.user!.role === 'STUDENT' ? {
          where: {
            studentId: req.user!.id
          }
        } : true
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check access rights
    if (
      assignment.teacherId !== req.user!.id &&
      !(await prisma.enrollment.findUnique({
        where: {
          classId_studentId: {
            classId: assignment.classId,
            studentId: req.user!.id
          }
        }
      }))
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment details error:', error);
    res.status(500).json({ message: 'Error fetching assignment details' });
  }
});

// Update assignment
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('title').optional().trim().notEmpty(),
    body('instructions').optional().trim(),
    body('dueDate').optional().isISO8601(),
    body('timeLimit').optional().isInt({ min: 1 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const assignment = await prisma.assignment.findUnique({
        where: { id: req.params.id }
      });

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if (assignment.teacherId !== req.user!.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { title, instructions, dueDate, timeLimit } = req.body;

      const updatedAssignment = await prisma.assignment.update({
        where: { id: req.params.id },
        data: {
          title,
          instructions,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          timeLimit
        },
        include: {
          assessment: true,
          class: true
        }
      });

      res.json(updatedAssignment);
    } catch (error) {
      console.error('Update assignment error:', error);
      res.status(500).json({ message: 'Error updating assignment' });
    }
  }
);

// Delete assignment
router.delete('/:id', authenticateToken, authorizeRole('TEACHER'), async (req: Request, res: Response) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id }
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.teacherId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.assignment.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
});

export default router; 