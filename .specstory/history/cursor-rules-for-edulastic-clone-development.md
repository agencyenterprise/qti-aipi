## SpecStory

## Cursor Rules for Edulastic Clone Development (1/28/2025, 3:10:28 PM)

_**User**_

Can you generate me a .cursorrules file that an llm like calude-3.5-sonnet-20241022 will understand and follow? You can look at the @Codebase Please explain the architecture to the llm.

There are some key points to keep in mind. The base vite application build is done and in the qti-aipi folder. Nothing should be build outside of this folder and this is an extremely important rule. There are components and types as a base example for tools that can be used to build an edulastic clone based off of the qti 3.0 specification in the src/components and src/types folder

The first prompt that the llm will get before looking at the code and building something is to build an edulastic clone. that is the primary objective. the secondary objective is for this clone to work with a qti 3.0 compliant api. I'd like for the cursor rules to explain the architecture of the api in a way that allows for seamless app building experience. It is imperative that an llm understands these rules and follows them.

here is the api info organized and explain using hexagonal archtecture.


# QTI System - API layout - http://localhost:3000/api/

## Domain Layer

### Core Entities

#### AssessmentItem

- **Identity**: identifier (string)
- **Properties**:
  - title
  - qtiVersion
  - itemBody
  - responseDeclarations
  - outcomeDeclarations
  - templateDeclarations
  - metadata

#### AssessmentTest

- **Identity**: identifier (string)
- **Properties**:
  - title
  - qtiVersion
  - testParts
  - outcomeDeclarations
  - timeLimits
  - metadata

#### Section

- **Identity**: identifier (string)
- **Properties**:
  - title
  - assessmentTestId
  - visible
  - ordering
  - preConditions
  - branchRules
  - itemReferences
  - metadata

#### Curriculum

- **Identity**: identifier (string)
- **Properties**:
  - tests (relationship with AssessmentTest)
  - testSequence

### Value Objects

#### QTIMetadata

- itemTemplate
- timeDependent
- composite
- interactionType
- portableCustomInteractionContext
- feedbackType
- solutionAvailable
- scoringMode
- toolName
- toolVersion
- toolVendor

#### TestPart

- identifier
- navigationMode
- submissionMode
- preConditions
- branchRules
- itemSessionControl
- timeLimits

#### ItemBody

- elements
- interactions

## Application Layer (Use Cases)

### AssessmentItem Use Cases

1. Create Assessment Item from QTI XML
2. Search Assessment Items
3. Get Assessment Item by Identifier
4. Update Assessment Item
5. Delete Assessment Item

### AssessmentTest Use Cases

1. Create Assessment Test from JSON
2. Search Assessment Tests
3. Get Assessment Test by Identifier
4. Update Assessment Test
5. Delete Assessment Test

### Section Use Cases

1. Create Section from XML
2. Create Section
3. Search Sections
4. Get Section by Identifier
5. Update Section
6. Delete Section
7. Add Item to Section
8. Remove Item from Section
9. Update Item Order in Section

### Curriculum Use Cases

1. Search Curricula
2. Get Curriculum by Identifier
3. Create Curriculum
4. Update Curriculum
5. Delete Curriculum
6. Add Test to Curriculum
7. Remove Test from Curriculum
8. Update Test Sequence

## Ports

### Primary Ports (Driving/Input)

```typescript
interface AssessmentItemPort {
  createFromQtiXml(xml: string): Promise<AssessmentItem>;
  search(query?: string, metadata?: string): Promise<AssessmentItem[]>;
  getByIdentifier(identifier: string): Promise<AssessmentItem>;
  update(
    identifier: string,
    data: Partial<AssessmentItem>
  ): Promise<AssessmentItem>;
  delete(identifier: string): Promise<void>;
}

interface AssessmentTestPort {
  createFromJson(data: any): Promise<AssessmentTest>;
  search(): Promise<AssessmentTest[]>;
  getByIdentifier(identifier: string): Promise<AssessmentTest>;
  update(
    identifier: string,
    data: Partial<AssessmentTest>
  ): Promise<AssessmentTest>;
  delete(identifier: string): Promise<void>;
}

interface SectionPort {
  createFromXml(xml: string): Promise<Section>;
  create(data: any): Promise<Section>;
  search(): Promise<Section[]>;
  getByIdentifier(identifier: string): Promise<Section>;
  update(identifier: string, data: any): Promise<Section>;
  delete(identifier: string): Promise<void>;
  addItem(identifier: string, itemId: string): Promise<void>;
  removeItem(identifier: string, itemId: string): Promise<void>;
  updateItemOrder(
    identifier: string,
    itemId: string,
    order: number
  ): Promise<void>;
}

interface CurriculumPort {
  search(): Promise<Curriculum[]>;
  getByIdentifier(identifier: string): Promise<Curriculum>;
  create(data: any): Promise<Curriculum>;
  update(identifier: string, data: any): Promise<Curriculum>;
  delete(identifier: string): Promise<void>;
  addTest(identifier: string, testId: string): Promise<void>;
  removeTest(identifier: string, testId: string): Promise<void>;
  updateTestSequence(
    identifier: string,
    testId: string,
    sequence: number
  ): Promise<void>;
}
```

### Secondary Ports (Driven/Output)

```typescript
interface QtiRepository {
  saveAssessmentItem(item: AssessmentItem): Promise<void>;
  saveAssessmentTest(test: AssessmentTest): Promise<void>;
  saveSection(section: Section): Promise<void>;
  saveCurriculum(curriculum: Curriculum): Promise<void>;

  findAssessmentItem(identifier: string): Promise<AssessmentItem>;
  findAssessmentTest(identifier: string): Promise<AssessmentTest>;
  findSection(identifier: string): Promise<Section>;
  findCurriculum(identifier: string): Promise<Curriculum>;

  deleteAssessmentItem(identifier: string): Promise<void>;
  deleteAssessmentTest(identifier: string): Promise<void>;
  deleteSection(identifier: string): Promise<void>;
  deleteCurriculum(identifier: string): Promise<void>;
}

interface QtiXmlParser {
  parseAssessmentItem(xml: string): AssessmentItem;
  parseSection(xml: string): Section;
}

interface QtiXmlConverter {
  convertToXml(item: AssessmentItem): string;
  convertToXml(section: Section): string;
}
```

## Adapters

### Primary Adapters (Driving/Input)

- REST API Controllers (Express.js)
  - AssessmentItemController
  - AssessmentTestController
  - SectionController
  - CurriculumController

### Secondary Adapters (Driven/Output)

- Database Repositories
  - PostgreSQL Implementation of QtiRepository
- XML Services
  - QtiXmlParserImpl
  - QtiXmlConverterImpl

## API Routes

### Assessment Items (`/assessment-items`)

- POST `/` - Create from QTI XML
- GET `/` - Search items
- GET `/:identifier` - Get item by identifier
- PUT `/:identifier` - Update item
- DELETE `/:identifier` - Delete item

### Assessment Tests (`/assessment-tests`)

- POST `/` - Create from JSON
- GET `/` - Search tests
- GET `/:identifier` - Get test by identifier
- PUT `/:identifier` - Update test
- DELETE `/:identifier` - Delete test

### Sections (`/sections`)

- POST `/xml` - Create from XML
- POST `/` - Create section
- GET `/` - Search sections
- GET `/:identifier` - Get section by identifier
- PUT `/:identifier` - Update section
- DELETE `/:identifier` - Delete section
- POST `/:identifier/items` - Add item to section
- DELETE `/:identifier/items/:itemId` - Remove item from section
- PUT `/:identifier/items/:itemId/order` - Update item order

### Curriculum (`/curriculum`)

- GET `/` - Search curricula
- GET `/:identifier` - Get curriculum by identifier
- POST `/` - Create curriculum
- PUT `/:identifier` - Update curriculum
- DELETE `/:identifier` - Delete curriculum
- POST `/:identifier/tests` - Add test to curriculum
- DELETE `/:identifier/tests/:testId` - Remove test from curriculum
- PUT `/:identifier/tests/:testId/sequence` - Update test sequence


---

_**Assistant**_

I'll help create a comprehensive .cursorrules file that explains the architecture and sets clear guidelines for LLMs. Here's the content:

```typescript:cursor/aisettings
/**
 * QTI Assessment Editor - Architecture and Development Guidelines
 * 
 * IMPORTANT: All development must occur within the qti-aipi folder!
 */

// Core Development Rules
const developmentRules = {
  rootDirectory: "qti-aipi",
  buildConstraints: "All development must occur within qti-aipi folder",
  primaryObjective: "Build an Edulastic clone with QTI 3.0 compliance",
  secondaryObjective: "Integrate with QTI 3.0 compliant API",
};

// Application Architecture
const architecture = {
  frontend: {
    framework: "Next.js",
    baseComponents: {
      location: "src/components",
      examples: [
        "AssessmentItem.tsx", // Base component for QTI items
        "ItemBody.tsx" // Handles item content and interactions
      ]
    },
    typeDefinitions: {
      location: "src/types",
      coreTypes: [
        "assessment-item.ts",
        "assessment-test.ts",
        "item-body.ts",
        "qti-types.ts"
      ]
    }
  },
  
  api: {
    baseUrl: "http://localhost:3000/api",
    architecture: "Hexagonal (Ports & Adapters)",
    
    domain: {
      coreEntities: [
        "AssessmentItem",
        "AssessmentTest",
        "Section",
        "Curriculum"
      ],
      valueObjects: [
        "QTIMetadata",
        "TestPart",
        "ItemBody"
      ]
    },
    
    ports: {
      primary: [
        "AssessmentItemPort",
        "AssessmentTestPort",
        "SectionPort",
        "CurriculumPort"
      ],
      secondary: [
        "QtiRepository",
        "QtiXmlParser",
        "QtiXmlConverter"
      ]
    },
    
    endpoints: {
      assessmentItems: {
        base: "/assessment-items",
        operations: [
          "POST / - Create from QTI XML",
          "GET / - Search items",
          "GET /:identifier - Get by ID",
          "PUT /:identifier - Update",
          "DELETE /:identifier - Delete"
        ]
      },
      assessmentTests: {
        base: "/assessment-tests",
        operations: [/* similar CRUD operations */]
      },
      sections: {
        base: "/sections",
        operations: [/* section-specific operations */]
      },
      curriculum: {
        base: "/curriculum",
        operations: [/* curriculum-specific operations */]
      }
    }
  }
};

// Development Guidelines
const guidelines = {
  componentDevelopment: {
    location: "src/components",
    rules: [
      "Use TypeScript for all components",
      "Follow QTI 3.0 specification strictly",
      "Implement proper type checking",
      "Include JSDoc documentation"
    ]
  },
  
  typeDefinitions: {
    location: "src/types",
    rules: [
      "Define interfaces for all QTI elements",
      "Use strict typing",
      "Include QTI spec references in comments"
    ]
  },
  
  apiIntegration: {
    rules: [
      "Use provided API endpoints",
      "Handle XML parsing/generation",
      "Implement proper error handling",
      "Follow RESTful practices"
    ]
  }
};

// Architectural Constraints
const constraints = {
  buildLocation: "qti-aipi folder only",
  apiCompliance: "Must follow QTI 3.0 specification",
  componentStructure: "Follow existing component patterns",
  typeSystem: "Use provided type definitions",
  stateManagement: "Use React hooks and context",
  dataFlow: "Follow unidirectional data flow"
};

/**
 * Instructions for LLMs:
 * 1. All new code must be created within qti-aipi folder
 * 2. Use existing type definitions from src/types
 * 3. Follow component patterns from src/components
 * 4. Integrate with API using provided endpoints
 * 5. Maintain QTI 3.0 compliance
 * 6. Document code with JSDoc comments
 * 7. Include type safety checks
 * 8. Follow hexagonal architecture patterns
 */
```

This .cursorrules file:

1. Clearly defines the development boundaries (qti-aipi folder)
2. Explains the application architecture (frontend and API)
3. Provides clear guidelines for component and type development
4. Documents the API structure using hexagonal architecture
5. Sets constraints for development
6. Gives explicit instructions for LLMs

The file is structured to help LLMs understand:
- Where to create new code (qti-aipi folder)
- How to use existing components and types
- How to integrate with the API
- How to maintain QTI 3.0 compliance
- The overall architecture and patterns to follow

This should help LLMs maintain consistency and follow the proper architecture while building the Edulastic clone.

---



---

