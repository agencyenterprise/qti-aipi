import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question } from '../../types/question';

interface QuestionsState {
  items: Question[];
  selectedQuestion: Question | null;
  loading: boolean;
  error: string | null;
  filters: {
    type?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
    search?: string;
  };
}

const initialState: QuestionsState = {
  items: [],
  selectedQuestion: null,
  loading: false,
  error: null,
  filters: {},
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.items = action.payload;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.items.push(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.items.findIndex(item => item.identifier === action.payload.identifier);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteQuestion: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.identifier !== action.payload);
    },
    setSelectedQuestion: (state, action: PayloadAction<Question | null>) => {
      state.selectedQuestion = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<QuestionsState['filters']>) => {
      state.filters = action.payload;
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
  setFilters,
} = questionsSlice.actions;

export default questionsSlice.reducer; 