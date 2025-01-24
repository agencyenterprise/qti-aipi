import { configureStore } from '@reduxjs/toolkit';
import assessmentsReducer from './slices/assessmentsSlice';
import questionsReducer from './slices/questionsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    assessments: assessmentsReducer,
    questions: questionsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 