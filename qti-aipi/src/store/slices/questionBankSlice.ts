import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssessmentItem } from '../../types/qti-types';

interface QuestionBankState {
  items: AssessmentItem[];
  selectedItems: string[];
  filters: {
    interactionType?: string;
    searchQuery?: string;
    tags?: string[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: QuestionBankState = {
  items: [],
  selectedItems: [],
  filters: {},
  loading: false,
  error: null,
};

const questionBankSlice = createSlice({
  name: 'questionBank',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<AssessmentItem[]>) => {
      state.items = action.payload;
    },
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
    setSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedItems.indexOf(action.payload);
      if (index === -1) {
        state.selectedItems.push(action.payload);
      } else {
        state.selectedItems.splice(index, 1);
      }
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
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setSelectedItems,
  toggleItemSelection,
  setFilters,
  setLoading,
  setError,
} = questionBankSlice.actions;

export default questionBankSlice.reducer; 