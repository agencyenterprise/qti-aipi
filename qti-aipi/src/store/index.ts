import { configureStore } from '@reduxjs/toolkit';
import assessmentsReducer from './slices/assessmentsSlice';
import questionBankReducer from './slices/questionBankSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    assessments: assessmentsReducer,
    questionBank: questionBankReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the state types
export type { UIState } from './slices/uiSlice';
export type { QuestionBankState } from './slices/questionBankSlice';
export type { AssessmentsState } from './slices/assessmentsSlice'; 