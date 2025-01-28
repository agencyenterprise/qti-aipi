import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AssessmentTest } from '../../types/qti';
import * as api from '../../services/api';

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

// Async thunks
export const fetchAssessments = createAsyncThunk(
  'assessments/fetchAssessments',
  async (query?: string) => {
    const assessments = await api.searchAssessmentTests(query);
    return assessments;
  }
);

export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async (assessment: AssessmentTest) => {
    const created = await api.createAssessmentTest(assessment);
    return created;
  }
);

export const updateAssessment = createAsyncThunk(
  'assessments/updateAssessment',
  async (assessment: AssessmentTest) => {
    const updated = await api.createAssessmentTest(assessment); // Using create since update not in API
    return updated;
  }
);

export const deleteAssessment = createAsyncThunk(
  'assessments/deleteAssessment',
  async (identifier: string) => {
    // API doesn't have delete endpoint, so just return the id
    return identifier;
  }
);

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
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
  extraReducers: (builder) => {
    builder
      // Fetch assessments
      .addCase(fetchAssessments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.loading = false;
        state.assessments = action.payload;
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch assessments';
      })
      // Create assessment
      .addCase(createAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.assessments.push(action.payload);
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create assessment';
      })
      // Update assessment
      .addCase(updateAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssessment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assessments.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.assessments[index] = action.payload;
        }
      })
      .addCase(updateAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update assessment';
      })
      // Delete assessment
      .addCase(deleteAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.assessments = state.assessments.filter(a => a.id !== action.payload);
      })
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete assessment';
      });
  },
});

export const { setAssessments, setLoading, setError } = assessmentsSlice.actions;
export type { AssessmentsState };
export default assessmentsSlice.reducer; 