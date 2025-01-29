## SpecStory

## Updating README for QTI Assessment Editor (1/27/2025, 8:26:48 PM)

_**User**_

@Codebase can we update this readme to reflect the current state of the file. we are no longer running vite, the llm will just build from prompts

---

_**Assistant**_

I'll help update the README.md to better reflect the current state of the project as an AI prompting system. Here's the revised version:

```markdown:README.md
# QTI Assessment Editor

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Important: AI Prompting System

This repository serves as an AI prompting system that guides you in building a Next.js frontend application for QTI assessment editing. By following the prompting guidelines and providing clear requirements, you can interact with AI to help you develop the necessary components, features, and functionality.

The AI assistant is configured to understand:

- QTI 3.0 specification requirements
- Next.js frontend development patterns
- CSV-based data persistence strategies
- Component architecture and best practices

When interacting with the AI, you'll receive guidance, code snippets, and implementation details for building out your QTI editor application.

## Development Guidelines

All development must occur within the `qti-aipi` folder. The project follows a hexagonal architecture pattern and strict TypeScript typing. Key points:

- Use TypeScript for all components
- Follow QTI 3.0 specification strictly
- Implement proper type checking
- Include JSDoc documentation
- Follow provided API endpoint patterns
- Maintain unidirectional data flow

## About The Application

This is a Question & Test Interoperability (QTI) 3.0 Assessment Editor built with Next.js. The application's primary purpose is to provide a user-friendly interface for:

- Uploading and importing existing QTI 3.0 compliant questions and tests
- Creating and editing assessment questions through an intuitive interface
- Organizing questions into tests and assessment sets
- Saving work-in-progress and completed assessments
- Exporting questions and tests in QTI 3.0 compliant format

Key Features:

- **Question Management**: Upload, create, edit, and organize assessment test questions
- **QTI Compliance**: Automatic validation against QTI 3.0 standards

## Using the AI Prompting System

1. Review the existing architecture and guidelines in `.cursor/rules/aisettings`
2. Follow the API specifications in `qti-api.yaml`
3. Make requests for specific components or features
4. The AI will provide implementation details following project standards

## Contributing

When contributing to this project, please ensure your changes comply with the QTI 3.0 specification. All new features should include appropriate validation and error handling.

## Documentation

- [QTI 3.0 Specification](https://www.imsglobal.org/spec/qti/v3p0/impl)

## Support

For questions and support:

1. Check the documentation first
2. Review existing issues
3. Create a new issue with a clear description following the prompting guidelines above
```

Key changes made:
1. Removed the "Getting Started" section with npm commands since this is now a prompting system
2. Added a new "Using the AI Prompting System" section
3. Updated the introduction to better emphasize the AI prompting nature
4. Referenced the important configuration files (.cursor/rules/aisettings and qti-api.yaml)
5. Maintained all the core architectural and feature descriptions as they're still relevant

---



---

