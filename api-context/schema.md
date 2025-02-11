```typescript
import mongoose from "mongoose";

//------------------------------------------------------------------------------
// Base Type Definitions and Enums
//------------------------------------------------------------------------------
export const NavigationMode = {
  LINEAR: "linear",
  NONLINEAR: "nonlinear",
} as const;
export type NavigationModeType =
  (typeof NavigationMode)[keyof typeof NavigationMode];

export const SubmissionMode = {
  INDIVIDUAL: "individual",
  SIMULTANEOUS: "simultaneous",
} as const;
export type SubmissionModeType =
  (typeof SubmissionMode)[keyof typeof SubmissionMode];

export const BaseType = {
  IDENTIFIER: "identifier",
  BOOLEAN: "boolean",
  INTEGER: "integer",
  FLOAT: "float",
  STRING: "string",
  POINT: "point",
  PAIR: "pair",
  DIRECTED_PAIR: "directedPair",
  DURATION: "duration",
  FILE: "file",
  URI: "uri",
} as const;
export type BaseTypeType = (typeof BaseType)[keyof typeof BaseType];

export const Cardinality = {
  SINGLE: "single",
  MULTIPLE: "multiple",
  ORDERED: "ordered",
  RECORD: "record",
} as const;
export type CardinalityType = (typeof Cardinality)[keyof typeof Cardinality];

//------------------------------------------------------------------------------
// Base Schemas (Reusable Components)
//------------------------------------------------------------------------------
const elementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["text", "interaction", "math", "feedback"],
  },
  content: { type: String, required: true },
  identifier: String,
  responseIdentifier: String,
});

const itemBodySchema = new mongoose.Schema({
  elements: [elementSchema],
});

const responseDeclarationSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  cardinality: {
    type: String,
    required: true,
    enum: Object.values(Cardinality),
  },
  baseType: { type: String, required: true, enum: Object.values(BaseType) },
  correctResponse: {
    value: [String],
  },
});

const outcomeDeclarationSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  cardinality: {
    type: String,
    required: true,
    enum: Object.values(Cardinality),
  },
  baseType: { type: String, required: true, enum: Object.values(BaseType) },
  normalMaximum: Number,
  normalMinimum: Number,
  defaultValue: {
    value: mongoose.Schema.Types.Mixed,
  },
});

//------------------------------------------------------------------------------
// Curriculum Schemas
//------------------------------------------------------------------------------
const curriculumSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

//------------------------------------------------------------------------------
// QTI Assessment Test Schemas
//------------------------------------------------------------------------------
const qtiItemRefSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  href: { type: String, required: true },
});

const qtiTestPartSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  "qti-assessment-section": [
    {
      identifier: { type: String, required: true },
      title: { type: String, required: true },
      visible: { type: Boolean, default: true },
      required: { type: Boolean, default: true },
      fixed: { type: Boolean, default: false },
      sequence: { type: Number, required: true },
      "qti-assessment-item-ref": [qtiItemRefSchema],
      metadata: mongoose.Schema.Types.Mixed,
    },
  ],
  submissionMode: {
    type: String,
    required: true,
    enum: Object.values(SubmissionMode),
  },
  navigationMode: {
    type: String,
    required: true,
    enum: Object.values(NavigationMode),
  },
});

const qtiAssessmentTestSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    qtiVersion: { type: String, default: "3.0" },
    "qti-test-part": [qtiTestPartSchema],
    "qti-outcome-declaration": [outcomeDeclarationSchema],
    timeLimit: Number,
    maxAttempts: Number,
    toolsEnabled: mongoose.Schema.Types.Mixed,
    metadata: mongoose.Schema.Types.Mixed,
    rawXml: { type: String, required: true },
    content: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

//------------------------------------------------------------------------------
// QTI Section Schemas
//------------------------------------------------------------------------------
const qtiSectionSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    assessmentTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentTest",
    },
    itemCount: Number,
    visible: { type: Boolean, default: true },
    required: { type: Boolean, default: true },
    fixed: { type: Boolean, default: false },
    sequence: { type: Number, required: true },
    "qti-assessment-item-ref": [qtiItemRefSchema],
    rawXml: { type: String, required: true },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

//------------------------------------------------------------------------------
// QTI Assessment Item Schemas
//------------------------------------------------------------------------------
const qtiAssessmentItemSchema = new mongoose.Schema(
  {
    identifier: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    qtiVersion: { type: String, default: "3.0" },
    baseType: {
      type: String,
      enum: Object.values(BaseType),
    },
    cardinality: {
      type: String,
      enum: Object.values(Cardinality),
    },
    timeDependent: { type: Boolean, default: false },
    adaptive: { type: Boolean, default: false },
    itemBody: itemBodySchema,
    responseDeclarations: [responseDeclarationSchema],
    outcomeDeclarations: [outcomeDeclarationSchema],
    responseProcessing: mongoose.Schema.Types.Mixed,
    metadata: mongoose.Schema.Types.Mixed,
    rawXml: { type: String, required: true },
    content: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

//------------------------------------------------------------------------------
// Relationship Schemas
//------------------------------------------------------------------------------
const curriculumTestSchema = new mongoose.Schema(
  {
    curriculumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curriculum",
      required: true,
    },
    assessmentTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QTIAssessmentTest",
      required: true,
    },
    sequence: { type: Number, required: true },
    required: { type: Boolean, default: true },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

const qtiSectionItemSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentItem",
      required: true,
    },
    orderIndex: { type: Number, required: true },
    required: { type: Boolean, default: true },
    selected: { type: Boolean, default: true },
    fixed: { type: Boolean, default: false },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

//------------------------------------------------------------------------------
// Model Exports
//------------------------------------------------------------------------------
export const Curriculum = mongoose.model(
  "Curriculum",
  curriculumSchema,
  "curriculums"
);
export const QTIAssessmentTest = mongoose.model(
  "QTIAssessmentTest",
  qtiAssessmentTestSchema,
  "qti-assessment-tests"
);
export const QTISection = mongoose.model(
  "QTISection",
  qtiSectionSchema,
  "qti-sections"
);
export const QTIAssessmentItem = mongoose.model(
  "QTIAssessmentItem",
  qtiAssessmentItemSchema,
  "qti-assessment-items"
);
export const CurriculumTest = mongoose.model(
  "CurriculumTest",
  curriculumTestSchema,
  "curriculum-qti-assessment-tests"
);
export const QTISectionItem = mongoose.model(
  "QTISectionItem",
  qtiSectionItemSchema,
  "qti-section-assessment-items"
);

//------------------------------------------------------------------------------
// Indexes
//------------------------------------------------------------------------------
curriculumSchema.index({ identifier: 1 }, { unique: true });
curriculumSchema.index({ title: "text" });

qtiAssessmentTestSchema.index({ identifier: 1 }, { unique: true });
qtiAssessmentTestSchema.index({ title: "text" });

qtiSectionSchema.index(
  { identifier: 1, assessmentTestId: 1 },
  { unique: true }
);
qtiSectionSchema.index({ title: "text" });

qtiAssessmentItemSchema.index({ identifier: 1 });
qtiAssessmentItemSchema.index({ title: "text" });

curriculumTestSchema.index(
  { curriculumId: 1, assessmentTestId: 1 },
  { unique: true }
);
curriculumTestSchema.index({ curriculumId: 1, sequence: 1 });

qtiSectionItemSchema.index({ sectionId: 1, itemId: 1 }, { unique: true });
qtiSectionItemSchema.index({ sectionId: 1, orderIndex: 1 });
```
