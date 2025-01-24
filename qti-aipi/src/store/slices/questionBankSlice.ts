import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QTIAssessmentItem } from '../../types/assessment-item';

interface QuestionBankState {
  questions: QTIAssessmentItem[];
  loading: boolean;
  error: string | null;
  selectedQuestionId: string | null;
}

const initialState: QuestionBankState = {
  questions: [],
  loading: false,
  error: null,
  selectedQuestionId: null,
};

const questionBankSlice = createSlice({
  name: 'questionBank',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<QTIAssessmentItem[]>) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action: PayloadAction<QTIAssessmentItem>) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<QTIAssessmentItem>) => {
      const index = state.questions.findIndex((question) => question.identifier === action.payload.identifier);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((question) => question.identifier !== action.payload);
    },
    setSelectedQuestion: (state, action: PayloadAction<string | null>) => {
      state.selectedQuestionId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setSelectedQuestion,
  setLoading,
  setError,
} = questionBankSlice.actions;

export default questionBankSlice.reducer; 