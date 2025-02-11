```typescript
import { z } from "zod";

/**
 * QTI 3.0 Interaction Type Validation
 *
 * This module provides Zod schemas for validating QTI 3.0 interaction types
 * and their required attributes based on the QTI 3.0 specification.
 */

/**
 * QTI 3.0 Assessment Test Validation
 *
 * This module provides Zod schemas for validating QTI 3.0 assessment tests
 * and their components based on the QTI 3.0 specification.
 */

// QTI Item Reference Schema
export const qtiItemRefSchema = z.object({
  identifier: z.string().min(1, "Item reference identifier is required"),
  href: z.string().min(1, "Item reference href is required"),
  required: z.boolean().optional(),
  fixed: z.boolean().optional(),
  class: z.array(z.string()).optional(),
  category: z.array(z.string()).optional(),
});

// QTI Section Schema
export const qtiSectionSchema = z.object({
  // Required attributes per QTI 3.0
  identifier: z.string().min(1, "Section identifier is required"),
  title: z.string().min(1, "Section title is required"),
  visible: z.boolean({
    required_error: "Section visible attribute is required",
  }),

  // Optional attributes per QTI 3.0
  required: z.boolean().optional(),
  fixed: z.boolean().optional(),
  class: z.array(z.string()).optional(),
  "keep-together": z.boolean().optional().default(true),
  "qti-assessment-item-ref": z.array(qtiItemRefSchema).optional(),
});

// QTI Test Part Schema
export const qtiTestPartSchema = z.object({
  identifier: z.string(),
  "qti-assessment-section": z.array(qtiSectionSchema).min(1),
  submissionMode: z.enum(["individual", "simultaneous"]),
  navigationMode: z.enum(["linear", "nonlinear"]),
});

// QTI Outcome Declaration Schema
export const qtiOutcomeDeclarationSchema = z.object({
  identifier: z.string(),
  cardinality: z.string(),
  baseType: z.string(),
  normalMaximum: z.number().optional(),
  normalMinimum: z.number().optional(),
  defaultValue: z
    .object({
      value: z.union([z.string(), z.number()]),
    })
    .optional(),
});

// QTI Assessment Test Schema
export const qtiAssessmentTestSchema = z.object({
  identifier: z.string(),
  title: z.string(),
  toolVersion: z.string().optional(),
  toolName: z.string().optional(),
  "qti-test-part": z.array(qtiTestPartSchema).min(1),
  outcomes: z.array(qtiOutcomeDeclarationSchema).optional(),
});

// Base attributes that all interactions must have
const baseInteractionSchema = z.object({
  responseIdentifier: z.string(),
});

// Choice Interaction Schema
const choiceInteractionSchema = baseInteractionSchema.extend({
  shuffle: z.boolean(),
  maxChoices: z.number().int().positive(),
});

// Order Interaction Schema
const orderInteractionSchema = baseInteractionSchema.extend({
  shuffle: z.boolean(),
});

// Associate Interaction Schema
const associateInteractionSchema = baseInteractionSchema.extend({
  shuffle: z.boolean(),
});

// Match Interaction Schema
const matchInteractionSchema = baseInteractionSchema.extend({
  shuffle: z.boolean(),
});

// Hotspot Interaction Schema
export const hotspotInteractionSchema = baseInteractionSchema.extend({
  maxChoices: z.number().min(1),
  questionStructure: z.object({
    object: z.object({
      data: z.string(),
      height: z.number().min(1),
      width: z.number().min(1),
      type: z.string(),
    }),
    hotspots: z
      .array(
        z.object({
          identifier: z.string(),
          shape: z.enum(["circle", "rect", "poly"]),
          coords: z.string(),
        })
      )
      .min(1),
  }),
});

// Select Point Interaction Schema
const selectPointInteractionSchema = baseInteractionSchema.extend({
  maxChoices: z.number().int().positive(),
  questionStructure: z.object({
    prompt: z.string().optional(),
    object: z.object({
      data: z.string(),
      height: z.number().int().positive(),
      width: z.number().int().positive(),
      type: z.string(),
    }),
  }),
});

// Graphic Order Interaction Schema
const graphicOrderInteractionSchema = baseInteractionSchema.extend({
  shuffle: z.boolean(),
  questionStructure: z.object({
    prompt: z.string().optional(),
    object: z.object({
      data: z.string(),
      height: z.number().int().positive(),
      width: z.number().int().positive(),
      type: z.string(),
    }),
    orderChoices: z
      .array(
        z.object({
          identifier: z.string(),
          shape: z.enum(["circle", "rect", "poly"]),
          coords: z.string(),
        })
      )
      .min(2),
  }),
});

// Graphic Associate Interaction Schema
const graphicAssociateInteractionSchema = baseInteractionSchema.extend({
  shuffle: z.boolean(),
  maxAssociations: z.number().int().positive(),
  questionStructure: z.object({
    prompt: z.string().optional(),
    object: z.object({
      data: z.string(),
      height: z.number().int().positive(),
      width: z.number().int().positive(),
      type: z.string(),
    }),
    associableHotspots: z
      .array(
        z.object({
          identifier: z.string(),
          shape: z.enum(["circle", "rect", "poly"]),
          coords: z.string(),
          matchMax: z.number().int().positive(),
        })
      )
      .min(2),
  }),
});

// Graphic Gap Match Interaction Schema
const graphicGapMatchInteractionSchema = baseInteractionSchema.extend({
  shuffle: z.boolean(),
  questionStructure: z.object({
    prompt: z.string().optional(),
    object: z.object({
      data: z.string(),
      height: z.number().int().positive(),
      width: z.number().int().positive(),
      type: z.string(),
    }),
    gapImgs: z
      .array(
        z.object({
          identifier: z.string(),
          matchMax: z.number().int().positive(),
          object: z.object({
            data: z.string(),
            height: z.number().int().positive(),
            width: z.number().int().positive(),
            type: z.string(),
          }),
        })
      )
      .min(1),
    associableHotspots: z
      .array(
        z.object({
          identifier: z.string(),
          shape: z.enum(["circle", "rect", "poly"]),
          coords: z.string(),
          matchMax: z.number().int().positive(),
        })
      )
      .min(1),
  }),
});

// Text Entry Interaction Schema
const textEntryInteractionSchema = baseInteractionSchema.extend({
  attributes: z.object({
    "expected-length": z.number().int().positive(),
    pattern: z
      .string()
      .regex(/^\/.*\/$/)
      .optional(), // Must be a valid regex pattern
    placeholder: z.string().optional(),
  }),
  questionStructure: z.object({
    prompt: z.string(),
  }),
});

// Extended Text Interaction Schema
const extendedTextInteractionSchema = baseInteractionSchema;

// Inline Choice Interaction Schema
const inlineChoiceInteractionSchema = baseInteractionSchema;

// Upload Interaction Schema
const uploadInteractionSchema = baseInteractionSchema.extend({
  questionStructure: z.object({
    prompt: z.string().optional(),
    allowedTypes: z.array(z.string()).min(1),
    maxSize: z.number().positive().optional(),
    maxFiles: z.number().int().positive().optional(),
  }),
});

// Slider Interaction Schema
const sliderInteractionSchema = baseInteractionSchema.extend({
  "lower-bound": z.number().nonnegative(),
  "upper-bound": z.number().nonnegative(),
  step: z.number().nonnegative().optional().default(1.0),
  "step-label": z.boolean().optional().default(false),
  orientation: z.enum(["horizontal", "vertical"]).optional(),
  reverse: z.boolean().optional(),
});

// Drawing Interaction Schema
const drawingInteractionSchema = baseInteractionSchema;

// Media Interaction Schema
const mediaInteractionSchema = baseInteractionSchema.extend({
  autostart: z.boolean(),
  minPlays: z.number().int().min(0),
});

// Custom Interaction Schema
const customInteractionSchema = baseInteractionSchema;

/**
 * Combined schema for all interaction types
 * This allows validation based on the interaction type
 */
export const qtiInteractionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("choice"), ...choiceInteractionSchema.shape }),
  z.object({ type: z.literal("order"), ...orderInteractionSchema.shape }),
  z.object({
    type: z.literal("associate"),
    ...associateInteractionSchema.shape,
  }),
  z.object({ type: z.literal("match"), ...matchInteractionSchema.shape }),
  z.object({ type: z.literal("hotspot"), ...hotspotInteractionSchema.shape }),
  z.object({
    type: z.literal("select-point"),
    ...selectPointInteractionSchema.shape,
  }),
  z.object({
    type: z.literal("graphic-order"),
    ...graphicOrderInteractionSchema.shape,
  }),
  z.object({
    type: z.literal("graphic-associate"),
    ...graphicAssociateInteractionSchema.shape,
  }),
  z.object({
    type: z.literal("graphic-gap-match"),
    ...graphicGapMatchInteractionSchema.shape,
  }),
  z.object({
    type: z.literal("text-entry"),
    ...textEntryInteractionSchema.shape,
  }),
  z.object({
    type: z.literal("extended-text"),
    ...extendedTextInteractionSchema.shape,
  }),
  z.object({
    type: z.literal("inline-choice"),
    ...inlineChoiceInteractionSchema.shape,
  }),
  z.object({ type: z.literal("upload"), ...uploadInteractionSchema.shape }),
  z.object({ type: z.literal("slider"), ...sliderInteractionSchema.shape }),
  z.object({ type: z.literal("drawing"), ...drawingInteractionSchema.shape }),
  z.object({ type: z.literal("media"), ...mediaInteractionSchema.shape }),
  z.object({ type: z.literal("custom"), ...customInteractionSchema.shape }),
]);

// Export type for TypeScript usage
export type QTIInteractionValidation = z.infer<typeof qtiInteractionSchema>;

/**
 * Helper function to validate an interaction
 * @param data The interaction data to validate
 * @returns Validated interaction data or throws ZodError
 */
export function validateInteraction(data: unknown) {
  return qtiInteractionSchema.parse(data);
}

/**
 * Helper function to safely validate an interaction
 * @param data The interaction data to validate
 * @returns { success: true, data } or { success: false, error }
 */
export function validateInteractionSafe(data: unknown) {
  const result = qtiInteractionSchema.safeParse(data);
  return result;
}

/**
 * Helper function to validate an assessment test
 * @param data The assessment test data to validate
 * @returns { success: true, data } or { success: false, error }
 */
export function validateAssessmentTestSafe(data: unknown) {
  const result = qtiAssessmentTestSchema.safeParse(data);
  return result;
}

// Required fields mapping (for reference)
export const requiredFields = {
  // Assessment Test Components
  assessmentTest: ["identifier", "title", "qti-test-part"],
  testPart: [
    "identifier",
    "qti-assessment-section",
    "submissionMode",
    "navigationMode",
  ],
  section: ["identifier", "title", "visible", "sequence"],
  itemRef: ["identifier", "href"],

  // Interaction Components (existing)
  choiceInteraction: ["responseIdentifier", "shuffle", "maxChoices"],
  textEntryInteraction: ["responseIdentifier", "attributes.expected-length"],
  extendedTextInteraction: ["responseIdentifier"],
  inlineChoiceInteraction: ["responseIdentifier"],
  orderInteraction: ["responseIdentifier", "shuffle"],
  associateInteraction: ["responseIdentifier", "shuffle"],
  matchInteraction: ["responseIdentifier", "shuffle"],
  hotspotInteraction: ["responseIdentifier", "maxChoices"],
  selectPointInteraction: ["responseIdentifier"],
  graphicOrderInteraction: ["responseIdentifier", "shuffle"],
  graphicAssociateInteraction: ["responseIdentifier", "shuffle"],
  graphicGapMatchInteraction: ["responseIdentifier", "shuffle"],
  uploadInteraction: ["responseIdentifier"],
  sliderInteraction: [
    "responseIdentifier",
    "lower-bound",
    "upper-bound",
    "step",
    "step-label",
    "orientation",
    "reverse",
  ],
  drawingInteraction: ["responseIdentifier"],
  mediaInteraction: ["responseIdentifier", "autostart", "minPlays"],
  customInteraction: ["responseIdentifier"],
} as const;
```
