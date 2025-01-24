import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QTIAssessmentTest } from '../../types/assessment-test';

interface AssessmentState {
  currentAssessment: QTIAssessmentTest | null;
  assessments: QTIAssessmentTest[];
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentState = {
  currentAssessment: null,
  assessments: [],
  loading: false,
  error: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setCurrentAssessment: (state, action: PayloadAction<QTIAssessmentTest>) => {
      state.currentAssessment = action.payload;
    },
    setAssessments: (state, action: PayloadAction<QTIAssessmentTest[]>) => {
      state.assessments = action.payload;
    },
    addAssessment: (state, action: PayloadAction<QTIAssessmentTest>) => {
      state.assessments.push(action.payload);
    },
    updateAssessment: (state, action: PayloadAction<QTIAssessmentTest>) => {
      const index = state.assessments.findIndex((assessment) => assessment.identifier === action.payload.identifier);
      if (index !== -1) {
        state.assessments[index] = action.payload;
      }
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
  setCurrentAssessment,
  setAssessments,
  addAssessment,
  updateAssessment,
  setLoading,
  setError,
} = assessmentSlice.actions;

export default assessmentSlice.reducer; 