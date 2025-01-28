import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssessmentTest, AssessmentItem, AssessmentSection } from '../../types/qti-types';

interface AssessmentsState {
  tests: AssessmentTest[];
  currentTest: AssessmentTest | null;
  currentItem: AssessmentItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentsState = {
  tests: [],
  currentTest: null,
  currentItem: null,
  loading: false,
  error: null,
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    setTests: (state, action: PayloadAction<AssessmentTest[]>) => {
      state.tests = action.payload;
    },
    addTest: (state, action: PayloadAction<AssessmentTest>) => {
      state.tests.push(action.payload);
    },
    updateTest: (state, action: PayloadAction<AssessmentTest>) => {
      const index = state.tests.findIndex(test => test.id === action.payload.id);
      if (index !== -1) {
        state.tests[index] = action.payload;
      }
    },
    deleteTest: (state, action: PayloadAction<string>) => {
      state.tests = state.tests.filter(test => test.id !== action.payload);
    },
    setCurrentTest: (state, action: PayloadAction<AssessmentTest | null>) => {
      state.currentTest = action.payload;
    },
    setCurrentItem: (state, action: PayloadAction<AssessmentItem | null>) => {
      state.currentItem = action.payload;
    },
    addSection: (state, action: PayloadAction<{ testId: string; section: AssessmentSection }>) => {
      const test = state.tests.find(t => t.id === action.payload.testId);
      if (test && test.testParts[0]) {
        test.testParts[0].sections.push(action.payload.section);
      }
    },
    addItemToSection: (state, action: PayloadAction<{ 
      testId: string; 
      sectionId: string; 
      item: AssessmentItem 
    }>) => {
      const test = state.tests.find(t => t.id === action.payload.testId);
      if (test) {
        const section = test.testParts[0]?.sections.find(s => s.id === action.payload.sectionId);
        if (section) {
          section.items.push(action.payload.item);
        }
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
  setTests,
  addTest,
  updateTest,
  deleteTest,
  setCurrentTest,
  setCurrentItem,
  addSection,
  addItemToSection,
  setLoading,
  setError,
} = assessmentsSlice.actions;

export default assessmentsSlice.reducer; 