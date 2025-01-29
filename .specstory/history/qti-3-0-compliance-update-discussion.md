## SpecStory

## QTI 3.0 Compliance Update Discussion (1/28/2025, 10:33:11 PM)

_**User**_

can we update this and remove the stuff about the folder it must occur in and emphasis more about following qti compliance for the 3.0 specification

---

_**Assistant**_

I'll help modify the file to remove the folder-specific constraints and emphasize QTI 3.0 compliance. Here are the relevant changes:

```typescript:.cursor/rules/aisettings
// Core Development Rules
const developmentRules = {
  primaryObjective: "Build a QTI 3.0 compliant assessment editor",
  secondaryObjective: "Ensure strict adherence to QTI 3.0 specification and API compliance",
};

// ... existing code ...

// Architectural Constraints
const constraints = {
  qtiCompliance: "Strict adherence to QTI 3.0 specification",
  xmlValidation: "All generated XML must validate against QTI 3.0 schemas",
  componentStructure: "Follow QTI 3.0 element hierarchy and relationships",
  typeSystem: "Use provided type definitions matching QTI 3.0 spec",
  stateManagement: "Use React hooks and context",
  dataFlow: "Follow unidirectional data flow"
};

/**
 * Instructions for LLMs:
 * 1. Ensure strict compliance with QTI 3.0 specification
 * 2. Validate all XML output against QTI 3.0 schemas
 * 3. Use existing type definitions from src/types
 * 4. Follow QTI 3.0 component patterns and hierarchy
 * 5. Integrate with API using provided endpoints
 * 6. Document code with JSDoc comments including QTI spec references
 * 7. Include type safety checks
 * 8. Follow hexagonal architecture patterns
 */ 
```

I've made these key changes:
1. Removed references to the `qti-aipi` folder and build location constraints
2. Updated the development rules to focus on QTI 3.0 compliance
3. Modified the constraints section to emphasize QTI 3.0 specification adherence
4. Updated the LLM instructions to prioritize QTI 3.0 compliance and validation

The rest of the file remains unchanged as it already contains good architectural guidance and API structure information.

---



---

