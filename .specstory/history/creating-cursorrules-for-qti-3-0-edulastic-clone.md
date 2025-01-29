## SpecStory

## Creating .cursorrules for QTI 3.0 Edulastic Clone (1/27/2025, 9:49:32 AM)

_**User**_

Can you generate me a .cursorrules file that looks at the file structures and points to the qti-aipi directory and then is able to return teh archtecture that an llm like claude-3.5-sonnet will be able to understand and use as guidance to a user who wants to build and edulastic clone based on the qti 3.0 specifications.

---

_**Assistant**_

I'll help you create a `.cursorrules` file that provides a clear architectural overview of your Edulastic clone project based on QTI 3.0 specifications. First, let me examine the existing structure to ensure we capture all the important aspects.

---

_**Assistant**_



---

_**Assistant**_



---

_**Assistant**_



Now I'll create a comprehensive `.cursorrules` file that describes the architecture and provides guidance for building an Edulastic clone based on QTI 3.0.

---

_**Assistant**_

```
{
    "project_root": "qti-aipi",
    "architecture_description": {
        "overview": "This project is a React-based Edulastic clone implementing QTI 3.0 specifications. It uses TypeScript, Redux for state management, and Tailwind CSS for styling.",
        "key_directories": {
            "src/": "Main source code directory containing React components, state management, and application logic",
            "src/components/": "Reusable UI components including QTI interaction types",
            "src/components/interactions/": "Implementation of QTI 3.0 interaction types (e.g., choice, text entry, match)",
            "src/types/": "TypeScript type definitions for QTI 3.0 data structures",
            "src/store/": "Redux store configuration and slices for state management",
            "src/pages/": "Main application pages/routes",
            "src/assets/": "Static assets like images and icons"
        },
        "core_concepts": {
            "assessment_structure": {
                "description": "Follows QTI 3.0 specification for assessment structure",
                "components": [
                    "AssessmentTest - Top-level container for the entire assessment",
                    "TestPart - Grouping of assessment sections",
                    "AssessmentSection - Groups of related items",
                    "AssessmentItem - Individual questions/interactions"
                ]
            },
            "interaction_types": {
                "description": "Implements QTI 3.0 interaction types",
                "components": [
                    "Choice Interactions",
                    "Text Entry Interactions",
                    "Match Interactions",
                    "Order Interactions",
                    "Extended Text Interactions"
                ]
            },
            "state_management": {
                "description": "Redux-based state management",
                "slices": [
                    "assessmentsSlice - Manages assessment data and structure",
                    "questionBankSlice - Handles question repository",
                    "uiSlice - Manages UI state and interactions"
                ]
            }
        },
        "development_guidelines": {
            "code_organization": [
                "Place new interaction types in src/components/interactions/",
                "Define TypeScript interfaces in src/types/",
                "Implement new features using Redux slices in src/store/slices/",
                "Follow React functional component patterns with hooks"
            ],
            "styling": [
                "Use Tailwind CSS for component styling",
                "Follow responsive design principles",
                "Maintain consistent UI components"
            ],
            "state_management": [
                "Use Redux for global state",
                "Implement proper action creators and reducers",
                "Follow Redux Toolkit patterns"
            ]
        },
        "key_features": [
            "Question authoring interface",
            "Assessment creation and management",
            "QTI 3.0 compliant interaction types",
            "Response processing and scoring",
            "Assessment preview and testing"
        ]
    },
    "recommended_tools": [
        "TypeScript for type safety",
        "Redux DevTools for state debugging",
        "React Developer Tools",
        "Vite for development server"
    ],
    "file_patterns": {
        "include": [
            "src/**/*.{ts,tsx}",
            "src/**/*.css"
        ],
        "exclude": [
            "node_modules",
            "dist",
            "build"
        ]
    }
}
```

---

_**Assistant**_



I've created a comprehensive `.cursorrules` file that provides a clear architectural overview of your Edulastic clone project. The file is structured in JSON format and includes:

1. Project root specification pointing to the `qti-aipi` directory
2. Detailed architecture description including:
   - Overview of the tech stack (React, TypeScript, Redux, Tailwind CSS)
   - Key directory structure and their purposes
   - Core concepts following QTI 3.0 specifications
   - Development guidelines
   - Key features
3. File patterns for inclusion/exclusion

The file is designed to help LLMs like Claude understand:
- The overall project structure
- How QTI 3.0 specifications are implemented
- Where to find and how to organize different types of code
- Best practices for development
- The state management approach
- UI component organization

This will help guide users who want to build an Edulastic clone by providing a clear architectural blueprint that follows QTI 3.0 specifications. The structure is organized to make it easy for both humans and AI to understand the project's organization and development patterns.

Would you like me to explain any specific part of the architecture in more detail or make any adjustments to the structure?

---



---

