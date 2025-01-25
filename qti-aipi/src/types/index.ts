export interface Question {
  id: string;
  type: string;
  content: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentsState {
  items: Assessment[];
  loading: boolean;
  error: string | null;
  currentAssessment: Assessment | null;
}

export interface QuestionBankState {
  questions: Question[];
  loading: boolean;
  error: string | null;
  filters: {
    type: string | null;
    difficulty: string | null;
    category: string | null;
    tags: string[];
  };
}

export interface UIState {
  sidebarOpen: boolean;
  currentView: string;
  notifications: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }[];
  theme: 'light' | 'dark';
}

export interface RootState {
  assessments: AssessmentsState;
  questionBank: QuestionBankState;
  ui: UIState;
} 