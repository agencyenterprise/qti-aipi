/**
 * Development Guidelines and Standards
 */

const development = {
  typescript: {
    strict: true,
    rules: [
      "Use TypeScript for all components",
      "Implement proper type checking",
      "Follow provided type definitions",
      "Include JSDoc documentation"
    ],
    typeDefinitions: {
      location: "src/types",
      required: [
        "qti-item.ts",
        "qti-test.ts",
        "qti-section.ts"
      ]
    }
  },

  components: {
    location: "src/components",
    patterns: [
      "Functional components with hooks",
      "Proper prop typing",
      "Error boundary implementation",
      "Loading state handling"
    ],
    templates: {
      location: "src/templates",
      types: [
        "multiple-choice.ts",
        "text-entry.ts",
        "matching.ts"
      ]
    }
  },

  dataFlow: {
    pattern: "Unidirectional",
    state: {
      local: "React hooks",
      global: "Context API"
    },
    validation: {
      input: "Zod schemas",
      output: "QTI XML validation"
    }
  },

  testing: {
    framework: "Jest + React Testing Library",
    coverage: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};