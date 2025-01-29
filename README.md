# EduAssess - Online Assessment Platform

EduAssess is a modern web application that facilitates online education by providing a platform for teachers to create and manage classes, assignments, and assessments, while allowing students to join classes and submit their work.

## Features

### For Teachers

- Create and manage classes
- Create assignments with due dates
- View and grade student submissions
- Track student progress
- Generate class-specific access codes

### For Students

- Join classes using access codes
- View and submit assignments
- Track assignment deadlines
- View grades and feedback

## Technology Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Material-UI (MUI)
  - React Router v7
  - Redux Toolkit
  - React Query
  - Formik & Yup
  - Axios

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 7.0.0

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/eduassess.git
cd eduassess
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── guards/       # Route protection components
│   └── layouts/      # Layout components
├── pages/            # Page components
│   ├── auth/         # Authentication pages
│   ├── teacher/      # Teacher-specific pages
│   └── student/      # Student-specific pages
├── services/         # API services
├── store/            # Redux store configuration
│   └── slices/       # Redux slices
├── theme.ts          # MUI theme configuration
├── App.tsx           # Root component
└── main.tsx         # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
