import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssessmentTest, AssessmentItem } from '../../types/qti';

export type { AssessmentItem };

interface AssessmentsState {
  assessments: AssessmentTest[];
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentsState = {
  assessments: [],
  loading: false,
  error: null,
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    addAssessment: (state, action: PayloadAction<AssessmentTest>) => {
      state.assessments.push(action.payload);
    },
    updateAssessment: (state, action: PayloadAction<AssessmentTest>) => {
      const index = state.assessments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.assessments[index] = action.payload;
      }
    },
    deleteAssessment: (state, action: PayloadAction<string>) => {
      state.assessments = state.assessments.filter(a => a.id !== action.payload);
    },
    setAssessments: (state, action: PayloadAction<AssessmentTest[]>) => {
      state.assessments = action.payload;
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
  addAssessment,
  updateAssessment,
  deleteAssessment,
  setAssessments,
  setLoading,
  setError,
} = assessmentsSlice.actions;

export type { AssessmentsState };
export default assessmentsSlice.reducer; 