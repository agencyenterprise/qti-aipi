import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { prisma } from '../db';
import { parseQtiXml } from '../utils/qtiXmlParser';
import { generateAssessmentItemXml, generateAssessmentTestXml } from '../utils/qtiXmlGenerator';
import { Prisma } from '@prisma/client';
import { validateRequest } from '../middleware/validate';

interface QTIAssessmentItem {
  identifier: string;
  title: string;
  baseType?: string;
  responseDeclarations?: Array<{
    identifier: string;
    baseType: string;
    cardinality: string;
  }>;
}

interface QTIAssessmentTest {
  identifier: string;
  title: string;
  navigationMode: string;
  submissionMode: string;
  sections: Array<{
    identifier: string;
    title: string;
    visible: boolean;
    keepTogether: boolean;
    items: Array<{
      identifier: string;
      href: string;
    }>;
  }>;
}

interface QtiTestPart {
  identifier: string;
  navigationMode: 'linear' | 'nonlinear';
  submissionMode: 'individual' | 'simultaneous';
  assessmentSections: QtiAssessmentSection[];
}

interface QtiAssessmentSection {
  identifier: string;
  title: string;
  visible: boolean;
  assessmentItems: QtiAssessmentItem[];
}

interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();

// Assessment Items
router.post('/assessment-items', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.is('application/xml') && !req.is('text/xml')) {
      return res.status(415).json({ error: 'Content-Type must be application/xml or text/xml' });
    }

    const xmlString = req.body.toString();
    const assessmentItem = parseQtiXml(xmlString) as QTIAssessmentItem;

    if ('sections' in assessmentItem) {
      return res.status(400).json({ error: 'Expected assessment item XML, got assessment test XML' });
    }

    const result = await prisma.qtiAssessmentItem.create({
      data: {
        identifier: assessmentItem.identifier,
        title: assessmentItem.title,
        baseType: assessmentItem.baseType,
        rawXml: xmlString
      }
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating assessment item:', error);
    res.status(400).json({ error: 'Failed to create assessment item' });
  }
});

router.get('/assessment-items', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { query, baseType } = req.query;
    const items = await prisma.qtiAssessmentItem.findMany({
      where: {
        AND: [
          query ? { title: { contains: query as string, mode: 'insensitive' } } : {},
          baseType ? { baseType: baseType as string } : {}
        ]
      }
    });

    // Check if client accepts XML
    const acceptXml = req.accepts('application/xml');
    const acceptJsonXml = req.accepts('application/json+xml');

    if (acceptXml) {
      res.setHeader('Content-Type', 'application/xml');
      // If only one item is found, return its raw XML
      if (items.length === 1) {
        return res.send(items[0].rawXml);
      }
      // If multiple items, wrap them in a root element
      const xmlItems = items.map((item) => item.rawXml).join('\n');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<qti-items>\n${xmlItems}\n</qti-items>`);
    }

    if (acceptJsonXml) {
      res.setHeader('Content-Type', 'application/json+xml');
      return res.json(items.map((item) => ({
        ...item,
        rawXml: Buffer.from(item.rawXml).toString('utf-8')
      })));
    }

    res.json(items);
  } catch (error) {
    console.error('Error searching assessment items:', error);
    res.status(500).json({ error: 'Failed to search assessment items' });
  }
});

router.get('/assessment-items/:identifier', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const item = await prisma.qtiAssessmentItem.findUnique({
      where: { identifier }
    });

    if (!item) {
      return res.status(404).json({ error: 'Assessment item not found' });
    }

    // Check if client accepts XML
    if (req.accepts('application/xml')) {
      res.setHeader('Content-Type', 'application/xml');
      return res.send(item.rawXml);
    }

    res.json(item);
  } catch (error) {
    console.error('Error getting assessment item:', error);
    res.status(500).json({ error: 'Failed to get assessment item' });
  }
});

// Sections
router.post('/sections', authenticateToken, async (req: Request, res: Response) => {
  try {
    // TODO: Implement section creation
    res.status(201).json({ message: 'Section created' });
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(400).json({ error: 'Failed to create section' });
  }
});

router.get('/sections', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { query, assessmentTest, parentId } = req.query;
    // TODO: Implement search logic
    res.json([]);
  } catch (error) {
    console.error('Error searching sections:', error);
    res.status(500).json({ error: 'Failed to search sections' });
  }
});

router.get('/sections/:identifier', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    // TODO: Implement get by ID logic
    res.json({ identifier });
  } catch (error) {
    console.error('Error getting section:', error);
    res.status(500).json({ error: 'Failed to get section' });
  }
});

// Assessment Tests
router.post('/assessment-tests', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.is('application/xml') && !req.is('text/xml')) {
      return res.status(415).json({ error: 'Content-Type must be application/xml or text/xml' });
    }

    const xmlString = req.body.toString();
    const assessmentTest = parseQtiXml(xmlString) as QTIAssessmentTest;

    if (!('sections' in assessmentTest)) {
      return res.status(400).json({ error: 'Expected assessment test XML, got assessment item XML' });
    }

    // Create the test and its sections in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the test
      const test = await tx.qtiAssessmentTest.create({
        data: {
          identifier: assessmentTest.identifier,
          title: assessmentTest.title,
          navigationMode: assessmentTest.navigationMode,
          submissionMode: assessmentTest.submissionMode,
          rawXml: xmlString
        }
      });

      // Create sections
      for (const section of assessmentTest.sections) {
        await tx.qtiSection.create({
          data: {
            identifier: section.identifier,
            title: section.title,
            visible: section.visible,
            keepTogether: section.keepTogether,
            testId: test.id,
            items: {
              connect: section.items.map(item => ({ identifier: item.identifier }))
            }
          }
        });
      }

      return test;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating assessment test:', error);
    res.status(400).json({ error: 'Failed to create assessment test' });
  }
});

router.get('/assessment-tests', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { query, navigationMode, submissionMode } = req.query;
    const tests = await prisma.qtiAssessmentTest.findMany({
      where: {
        AND: [
          query ? { title: { contains: query as string, mode: 'insensitive' } } : {},
          navigationMode ? { navigationMode: navigationMode as string } : {},
          submissionMode ? { submissionMode: submissionMode as string } : {}
        ]
      },
      include: {
        sections: {
          include: {
            items: true
          }
        }
      }
    });

    // Check if client accepts XML
    if (req.accepts('application/xml')) {
      res.setHeader('Content-Type', 'application/xml');
      // If only one test is found, return its raw XML
      if (tests.length === 1) {
        return res.send(tests[0].rawXml);
      }
      // If multiple tests, wrap them in a root element
      const xmlTests = tests.map((test) => test.rawXml).join('\n');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<qti-tests>\n${xmlTests}\n</qti-tests>`);
    }

    res.json(tests);
  } catch (error) {
    console.error('Error searching assessment tests:', error);
    res.status(500).json({ error: 'Failed to search assessment tests' });
  }
});

router.get('/assessment-tests/:identifier', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const test = await prisma.qtiAssessmentTest.findUnique({
      where: { identifier },
      include: {
        sections: {
          include: {
            items: true
          }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: 'Assessment test not found' });
    }

    // Check if client accepts XML
    if (req.accepts('application/xml')) {
      res.setHeader('Content-Type', 'application/xml');
      return res.send(test.rawXml);
    }

    res.json(test);
  } catch (error) {
    console.error('Error getting assessment test:', error);
    res.status(500).json({ error: 'Failed to get assessment test' });
  }
});

// Curriculum
router.post('/curriculum', authenticateToken, async (req: Request, res: Response) => {
  try {
    // TODO: Implement curriculum creation
    res.status(201).json({ message: 'Curriculum created' });
  } catch (error) {
    console.error('Error creating curriculum:', error);
    res.status(400).json({ error: 'Failed to create curriculum' });
  }
});

router.get('/curriculum', authenticateToken, async (req: Request, res: Response) => {
  try {
    // TODO: Implement search logic
    res.json([]);
  } catch (error) {
    console.error('Error searching curriculum:', error);
    res.status(500).json({ error: 'Failed to search curriculum' });
  }
});

router.get('/curriculum/:identifier', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    // TODO: Implement get by ID logic
    res.json({ identifier });
  } catch (error) {
    console.error('Error getting curriculum:', error);
    res.status(500).json({ error: 'Failed to get curriculum' });
  }
});

// Get all QTI assessments for a teacher
router.get('/assessments', authenticateToken, authorizeRole('TEACHER'), async (req: RequestWithUser, res: Response) => {
  try {
    const assessments = await prisma.qtiAssessment.findMany({
      where: {
        creatorId: req.user!.id
      },
      include: {
        testParts: {
          include: {
            sections: {
              include: {
                items: true
              }
            }
          }
        }
      }
    });

    res.json({ data: assessments });
  } catch (error) {
    console.error('Get QTI assessments error:', error);
    res.status(500).json({ message: 'Error fetching QTI assessments' });
  }
});

// Get QTI assessment by identifier
router.get('/assessments/:identifier', authenticateToken, async (req: RequestWithUser, res: Response) => {
  try {
    const assessment = await prisma.qtiAssessment.findUnique({
      where: {
        identifier: req.params.identifier
      },
      include: {
        testParts: {
          include: {
            sections: {
              include: {
                items: true
              }
            }
          }
        }
      }
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    // Check if user has access to this assessment
    if (assessment.creatorId !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ data: assessment });
  } catch (error) {
    console.error('Get QTI assessment error:', error);
    res.status(500).json({ message: 'Error fetching QTI assessment' });
  }
});

// Create QTI assessment
router.post(
  '/assessments',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('identifier').notEmpty().withMessage('Identifier is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('testParts').isArray().withMessage('Test parts must be an array'),
  ],
  validateRequest,
  async (req: RequestWithUser, res: Response) => {
    try {
      const { identifier, title, testParts } = req.body;

      // Check if assessment with identifier already exists
      const existingAssessment = await prisma.qtiAssessment.findUnique({
        where: { identifier }
      });

      if (existingAssessment) {
        return res.status(400).json({ message: 'Assessment with this identifier already exists' });
      }

      // Create assessment with nested relations
      const assessment = await prisma.qtiAssessment.create({
        data: {
          identifier,
          title,
          creatorId: req.user!.id,
          testParts: {
            create: testParts.map((part: QtiTestPart) => ({
              identifier: part.identifier,
              navigationMode: part.navigationMode,
              submissionMode: part.submissionMode,
              sections: {
                create: part.assessmentSections.map((section: QtiAssessmentSection) => ({
                  identifier: section.identifier,
                  title: section.title,
                  visible: section.visible,
                  items: {
                    create: section.assessmentItems.map((item: QtiAssessmentItem) => ({
                      identifier: item.identifier,
                      title: item.title,
                      adaptive: item.adaptive,
                      timeDependent: item.timeDependent,
                      interactionType: item.interactionType,
                      questionText: item.questionText,
                      correctResponse: item.correctResponse,
                    }))
                  }
                }))
              }
            }))
          }
        },
        include: {
          testParts: {
            include: {
              sections: {
                include: {
                  items: true
                }
              }
            }
          }
        }
      });

      res.status(201).json({ data: assessment });
    } catch (error) {
      console.error('Create QTI assessment error:', error);
      res.status(500).json({ message: 'Error creating QTI assessment' });
    }
  }
);

// Update QTI assessment
router.put(
  '/assessments/:identifier',
  authenticateToken,
  authorizeRole('TEACHER'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('testParts').isArray().withMessage('Test parts must be an array'),
  ],
  validateRequest,
  async (req: RequestWithUser, res: Response) => {
    try {
      const { identifier } = req.params;
      const { title, testParts } = req.body;

      // Check if assessment exists and user has access
      const existingAssessment = await prisma.qtiAssessment.findUnique({
        where: { identifier }
      });

      if (!existingAssessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      if (existingAssessment.creatorId !== req.user!.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Delete existing test parts (cascade will handle sections and items)
      await prisma.qtiTestPart.deleteMany({
        where: { assessmentId: existingAssessment.id }
      });

      // Update assessment with new data
      const assessment = await prisma.qtiAssessment.update({
        where: { identifier },
        data: {
          title,
          testParts: {
            create: testParts.map((part: QtiTestPart) => ({
              identifier: part.identifier,
              navigationMode: part.navigationMode,
              submissionMode: part.submissionMode,
              sections: {
                create: part.assessmentSections.map((section: QtiAssessmentSection) => ({
                  identifier: section.identifier,
                  title: section.title,
                  visible: section.visible,
                  items: {
                    create: section.assessmentItems.map((item: QtiAssessmentItem) => ({
                      identifier: item.identifier,
                      title: item.title,
                      adaptive: item.adaptive,
                      timeDependent: item.timeDependent,
                      interactionType: item.interactionType,
                      questionText: item.questionText,
                      correctResponse: item.correctResponse,
                    }))
                  }
                }))
              }
            }))
          }
        },
        include: {
          testParts: {
            include: {
              sections: {
                include: {
                  items: true
                }
              }
            }
          }
        }
      });

      res.json({ data: assessment });
    } catch (error) {
      console.error('Update QTI assessment error:', error);
      res.status(500).json({ message: 'Error updating QTI assessment' });
    }
  }
);

// Delete QTI assessment
router.delete(
  '/assessments/:identifier',
  authenticateToken,
  authorizeRole('TEACHER'),
  async (req: RequestWithUser, res: Response) => {
    try {
      const { identifier } = req.params;

      // Check if assessment exists and user has access
      const assessment = await prisma.qtiAssessment.findUnique({
        where: { identifier }
      });

      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }

      if (assessment.creatorId !== req.user!.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Delete assessment (cascade will handle test parts, sections, and items)
      await prisma.qtiAssessment.delete({
        where: { identifier }
      });

      res.json({ message: 'Assessment deleted successfully' });
    } catch (error) {
      console.error('Delete QTI assessment error:', error);
      res.status(500).json({ message: 'Error deleting QTI assessment' });
    }
  }
);

// Validate QTI assessment
router.post(
  '/validate',
  authenticateToken,
  authorizeRole('TEACHER'),
  async (req: RequestWithUser, res: Response) => {
    try {
      // TODO: Implement QTI validation logic
      res.json({ valid: true });
    } catch (error) {
      console.error('Validate QTI assessment error:', error);
      res.status(500).json({ message: 'Error validating QTI assessment' });
    }
  }
);

export default router; 
