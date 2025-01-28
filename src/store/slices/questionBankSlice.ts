import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { assessmentItemsApi } from '../../api/apiClient';
import type { AssessmentItem } from '../../types/qti-types';

// ... rest of imports and state interface ...

export const selectQuestionBank = createSelector(
  [(state: RootState) => state.questionBank],
  (questionBank) => ({
    items: questionBank.items,
    filteredItems: questionBank.filteredItems,
    filters: questionBank.filters,
    loading: questionBank.loading,
    error: questionBank.error
  })
);

// ... rest of the file stays the same ... 