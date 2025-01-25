import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment, AssessmentsState } from '../../types';

const initialState: AssessmentsState = {
  items: [],
  loading: false,
  error: null,
  currentAssessment: null,
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    setAssessments: (state, action: PayloadAction<Assessment[]>) => {
      state.items = action.payload;
    },
    addAssessment: (state, action: PayloadAction<Assessment>) => {
      state.items.push(action.payload);
    },
    updateAssessment: (state, action: PayloadAction<Assessment>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteAssessment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setCurrentAssessment: (state, action: PayloadAction<Assessment | null>) => {
      state.currentAssessment = action.payload;
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
  setAssessments,
  addAssessment,
  updateAssessment,
  deleteAssessment,
  setCurrentAssessment,
  setLoading,
  setError,
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer; 