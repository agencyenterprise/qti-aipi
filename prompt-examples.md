# QTI Application Development Guide

## Starter Prompts

1. **Basic Setup**

```
Can you build me an edulastic clone?
```

2. **Feature-Specific**

```
Can you build me an edulastic clone for teachers that is focused on questions created and assessment test management within a curriculum that follows qti 3.0 specification?
```

3. **Technical Integration**

```
Create a web application for educators that manages assessment content following the QTI 3.0 specification, connecting to the existing API on localhost:3000.
```

4. **Feature Addition**

```
Add a curriculum management system that allows organizing assessments into educational programs.
```

5. **Enhancement**

```
Implement QTI 3.0 compliant import/export functionality for assessment items and tests.
```

## Development Flow

1. **Project Initialization**

   - Setup Next.js with TypeScript
   - Configure Material-UI
   - Setup API client
   - Configure development environment

2. **Core Features Implementation**

   - Assessment item creation
   - Test assembly
   - Curriculum organization
   - QTI compliance layer

3. **Integration Layer**

   - API connectivity
   - Data validation
   - Error handling
   - State management

4. **Enhancement Phase**
   - User experience improvements
   - Performance optimization
   - Additional features
   - Testing and validation

## Prompt Writing Suggestions

1. **Start Broad, Then Narrow**

   - Begin with basic functionality
   - Add specific requirements incrementally
   - Include technical constraints last

2. **Include Context**

   - Specify target users
   - Define technical boundaries
   - Mention existing systems

3. **Define Scope**
   - List core features
   - Specify technical requirements
   - Include compliance needs

## Key Implementation Areas

1. **Assessment Management**

   - Item creation and editing
   - Test assembly
   - QTI compliance

2. **User Interface**

   - Teacher-focused features
   - Content organization
   - Assessment tools

3. **Technical Foundation**
   - API integration
   - Data persistence
   - Authentication

## Error Handling Pattern

1. Attempt operation
2. Detect failure
3. Show error
4. Provide recovery option
