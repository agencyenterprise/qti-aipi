```typescript
export const createValidAssessmentData = () => ({
  identifier: "test-001",
  title: "Basic Math Test",
  "qti-test-part": [
    {
      identifier: "part-1",
      navigationMode: "linear",
      submissionMode: "individual",
      "qti-assessment-section": [
        {
          identifier: "section-1",
          title: "Basic Arithmetic",
          visible: true,
          required: true,
          sequence: 1,
        },
      ],
    },
  ],
  "qti-outcome-declaration": [
    {
      identifier: "SCORE",
      cardinality: "single",
      baseType: "float",
    },
  ],
});

export const createValidSectionData = () => ({
  identifier: "section-2",
  title: "Basic Arithmetic Section",
  visible: true,
});
```
