import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { QuestionType } from '@prisma/client';

const router = express.Router();

// Create a new assessment (teachers only)
router.post(
  '/',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('questions').isArray().notEmpty(),
    body('questions.*.type').isIn(Object.values(QuestionType)),
    body('questions.*.content').trim().notEmpty(),
    body('questions.*.points').isInt({ min: 1 }),
    body('questions.*.options').optional().isArray(),
    body('questions.*.correctAnswer').optional().trim()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, questions } = req.body;

      const assessment = await prisma.assessment.create({
        data: {
          title,
          description,
          creatorId: req.user!.id,
          questions: {
            create: questions.map((q: any) => ({
              type: q.type,
              content: q.content,
              points: q.points,
              options: q.options || null,
              correctAnswer: q.correctAnswer || null
            }))
          }
        },
        include: {
          questions: true
        }
      });

      res.status(201).json(assessment);
    } catch (error) {
      console.error('Create assessment error:', error);
      res.status(500).json({ message: 'Error creating assessment' });
    }
  }
);

// Get all assessments for a teacher
router.get('/', authenticateToken, authorizeRole('TEACHER'), async (req: Request, res: Response) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        creatorId: req.user!.id
      },
      include: {
        _count: {
          select: {
            questions: true
          }
        }
      }
    });

    res.json(assessments);
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({ message: 'Error fetching assessments' });
  }
});

// Get assessment details
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: req.params.id },
      include: {
        questions: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if user has access to this assessment
    if (assessment.creatorId !== req.user!.id) {
      // For students, check if they have been assigned this assessment
      const assignment = await prisma.assignment.findFirst({
        where: {
          assessmentId: assessment.id,
          class: {
            enrollments: {
              some: {
                studentId: req.user!.id
              }
            }
          }
        }
      });

      if (!assignment) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    res.json(assessment);
  } catch (error) {
    console.error('Get assessment details error:', error);
    res.status(500).json({ message: 'Error fetching assessment details' });
  }
});

// Update assessment
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('questions').optional().isArray(),
    body('questions.*.type').optional().isIn(Object.values(QuestionType)),
    body('questions.*.content').optional().trim().notEmpty(),
    body('questions.*.points').optional().isInt({ min: 1 }),
    body('questions.*.options').optional().isArray(),
    body('questions.*.correctAnswer').optional().trim()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const assessment = await prisma.assessment.findUnique({
        where: { id: req.params.id }
      });

      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      if (assessment.creatorId !== req.user!.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const { title, description, questions } = req.body;

      // Update assessment and questions
      const updatedAssessment = await prisma.assessment.update({
        where: { id: req.params.id },
        data: {
          title,
          description,
          questions: questions ? {
            deleteMany: {},
            create: questions.map((q: any) => ({
              type: q.type,
              content: q.content,
              points: q.points,
              options: q.options || null,
              correctAnswer: q.correctAnswer || null
            }))
          } : undefined
        },
        include: {
          questions: true
        }
      });

      res.json(updatedAssessment);
    } catch (error) {
      console.error('Update assessment error:', error);
      res.status(500).json({ message: 'Error updating assessment' });
    }
  }
);

// Delete assessment
router.delete('/:id', authenticateToken, authorizeRole('TEACHER'), async (req: Request, res: Response) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: req.params.id }
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (assessment.creatorId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.assessment.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({ message: 'Error deleting assessment' });
  }
});

export default router; 