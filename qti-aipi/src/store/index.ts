import { configureStore } from '@reduxjs/toolkit';
import assessmentReducer from './slices/assessmentSlice';
import questionBankReducer from './slices/questionBankSlice';

export const store = configureStore({
  reducer: {
    assessment: assessmentReducer,
    questionBank: questionBankReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 