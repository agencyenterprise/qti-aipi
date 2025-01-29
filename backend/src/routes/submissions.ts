import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../index';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Start a submission
router.post(
  '/start',
  authenticateToken,
  authorizeRole('STUDENT'),
  [
    body('assignmentId').isString().notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { assignmentId } = req.body;

      // Check if assignment exists and student has access
      const assignment = await prisma.assignment.findFirst({
        where: {
          id: assignmentId,
          class: {
            enrollments: {
              some: {
                studentId: req.user!.id
              }
            }
          }
        },
        include: {
          assessment: {
            include: {
              questions: true
            }
          }
        }
      });

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found or not accessible' });
      }

      // Check if submission already exists
      const existingSubmission = await prisma.submission.findUnique({
        where: {
          studentId_assignmentId: {
            studentId: req.user!.id,
            assignmentId
          }
        }
      });

      if (existingSubmission) {
        return res.status(400).json({ message: 'Submission already exists' });
      }

      // Create submission
      const submission = await prisma.submission.create({
        data: {
          studentId: req.user!.id,
          assignmentId,
          startedAt: new Date()
        }
      });

      res.status(201).json(submission);
    } catch (error) {
      console.error('Start submission error:', error);
      res.status(500).json({ message: 'Error starting submission' });
    }
  }
);

// Submit answers
router.post(
  '/:id/answers',
  authenticateToken,
  authorizeRole('STUDENT'),
  [
    body('answers').isArray(),
    body('answers.*.questionId').isString().notEmpty(),
    body('answers.*.content').isString().notEmpty()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const submission = await prisma.submission.findUnique({
        where: {
          id: req.params.id
        },
        include: {
          assignment: {
            include: {
              assessment: {
                include: {
                  questions: true
                }
              }
            }
          }
        }
      });

      if (!submission || submission.studentId !== req.user!.id) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      if (submission.submittedAt) {
        return res.status(400).json({ message: 'Submission already completed' });
      }

      const { answers } = req.body;

      // Validate all questions belong to the assessment
      const validQuestionIds = new Set(submission.assignment.assessment.questions.map(q => q.id));
      for (const answer of answers) {
        if (!validQuestionIds.has(answer.questionId)) {
          return res.status(400).json({ message: 'Invalid question ID' });
        }
      }

      // Create answers and calculate score for objective questions
      let totalPoints = 0;
      let totalPossiblePoints = 0;

      await Promise.all(answers.map(async (answer: any) => {
        const question = submission.assignment.assessment.questions.find(q => q.id === answer.questionId);
        if (!question) return;

        totalPossiblePoints += question.points;

        const isCorrect = question.correctAnswer
          ? answer.content.toLowerCase() === question.correctAnswer.toLowerCase()
          : null;

        const points = isCorrect ? question.points : 0;
        if (isCorrect !== null) totalPoints += points;

        await prisma.answer.create({
          data: {
            content: answer.content,
            isCorrect,
            points,
            questionId: answer.questionId,
            submissionId: submission.id
          }
        });
      }));

      // Update submission
      const updatedSubmission = await prisma.submission.update({
        where: { id: submission.id },
        data: {
          submittedAt: new Date(),
          score: totalPossiblePoints > 0 ? (totalPoints / totalPossiblePoints) * 100 : null
        },
        include: {
          answers: true
        }
      });

      res.json(updatedSubmission);
    } catch (error) {
      console.error('Submit answers error:', error);
      res.status(500).json({ message: 'Error submitting answers' });
    }
  }
);

// Get submission details
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: req.params.id },
      include: {
        assignment: {
          include: {
            assessment: {
              include: {
                questions: true
              }
            },
            class: true
          }
        },
        answers: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check access rights
    if (
      submission.studentId !== req.user!.id &&
      submission.assignment.class.teacherId !== req.user!.id
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Error fetching submission' });
  }
});

// Grade submission (teachers only)
router.post(
  '/:id/grade',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('answers').isArray(),
    body('answers.*.answerId').isString().notEmpty(),
    body('answers.*.points').isFloat({ min: 0 })
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const submission = await prisma.submission.findUnique({
        where: { id: req.params.id },
        include: {
          assignment: {
            include: {
              assessment: {
                include: {
                  questions: true
                }
              }
            }
          },
          answers: true
        }
      });

      if (!submission || submission.assignment.teacherId !== req.user!.id) {
        return res.status(404).json({ message: 'Submission not found' });
      }

      const { answers } = req.body;

      // Update answer points
      await Promise.all(
        answers.map((answer: any) =>
          prisma.answer.update({
            where: { id: answer.answerId },
            data: { points: answer.points }
          })
        )
      );

      // Calculate total score
      const totalPoints = answers.reduce((sum: number, answer: any) => sum + answer.points, 0);
      const totalPossiblePoints = submission.assignment.assessment.questions.reduce(
        (sum, question) => sum + question.points,
        0
      );

      // Update submission score
      const updatedSubmission = await prisma.submission.update({
        where: { id: submission.id },
        data: {
          score: (totalPoints / totalPossiblePoints) * 100
        },
        include: {
          answers: true
        }
      });

      res.json(updatedSubmission);
    } catch (error) {
      console.error('Grade submission error:', error);
      res.status(500).json({ message: 'Error grading submission' });
    }
  }
);

export default router; 