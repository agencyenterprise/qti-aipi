import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { assessmentTestsApi, sectionsApi } from '../../api/apiClient';
import type { AssessmentTest, Section } from '../../types/qti-types';

// ... rest of imports and state interface ...

export const selectAssessments = createSelector(
  [(state: RootState) => state.assessments],
  (assessments) => ({
    tests: assessments.tests,
    currentTest: assessments.currentTest,
    sections: assessments.sections,
    currentSection: assessments.currentSection,
    loading: assessments.loading,
    error: assessments.error
  })
);

// ... rest of the file stays the same ... 