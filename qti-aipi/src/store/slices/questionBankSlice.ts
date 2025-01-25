import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuestionBankState } from '../../types';

const initialState: QuestionBankState = {
  questions: [],
  loading: false,
  error: null,
  filters: {
    type: null,
    difficulty: null,
    category: null,
    tags: [],
  },
};

const questionBankSlice = createSlice({
  name: 'questionBank',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(q => q.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<QuestionBankState['filters']>) => {
      state.filters = action.payload;
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
  setFilters,
  setLoading,
  setError,
} = questionBankSlice.actions;

export default questionBankSlice.reducer; 