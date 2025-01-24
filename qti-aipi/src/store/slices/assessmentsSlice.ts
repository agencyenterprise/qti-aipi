import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assessment } from '../../types/assessment-test';

interface AssessmentsState {
  items: Assessment[];
  selectedAssessment: Assessment | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentsState = {
  items: [],
  selectedAssessment: null,
  loading: false,
  error: null,
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
      const index = state.items.findIndex(item => item.identifier === action.payload.identifier);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteAssessment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.identifier !== action.payload);
    },
    setSelectedAssessment: (state, action: PayloadAction<Assessment | null>) => {
      state.selectedAssessment = action.payload;
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
  setSelectedAssessment,
  setLoading,
  setError,
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer; 