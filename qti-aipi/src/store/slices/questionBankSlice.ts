import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AssessmentItem } from '../../types/qti';

interface QuestionBankState {
  items: AssessmentItem[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionBankState = {
  items: [],
  loading: false,
  error: null,
};

const questionBankSlice = createSlice({
  name: 'questionBank',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<AssessmentItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<AssessmentItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setItems: (state, action: PayloadAction<AssessmentItem[]>) => {
      state.items = action.payload;
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
  addItem,
  updateItem,
  deleteItem,
  setItems,
  setLoading,
  setError,
} = questionBankSlice.actions;

export type { QuestionBankState };
export default questionBankSlice.reducer; 