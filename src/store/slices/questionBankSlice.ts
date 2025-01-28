import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AssessmentItem } from '../../types/qti';
import * as api from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

interface QuestionBankState {
  items: AssessmentItem[];
  loading: boolean;
  error: string | null;
}

const sampleQuestions: AssessmentItem[] = [
  {
    id: uuidv4(),
    title: 'Multiple Choice Question',
    qtiVersion: '3.0',
    itemBody: {
      elements: [],
      interactions: [
        {
          type: 'choice',
          prompt: 'What is the capital of France?',
          choices: [
            { id: 'A', content: 'London', isCorrect: false },
            { id: 'B', content: 'Paris', isCorrect: true },
            { id: 'C', content: 'Berlin', isCorrect: false },
            { id: 'D', content: 'Madrid', isCorrect: false },
          ],
        },
      ],
    },
    responseDeclarations: [],
    outcomeDeclarations: [],
    templateDeclarations: [],
    metadata: {
      itemTemplate: false,
      timeDependent: false,
      composite: false,
      interactionType: 'choice',
      feedbackType: 'none',
      solutionAvailable: true,
      scoringMode: 'automatic',
      toolName: 'QTI Editor',
      toolVersion: '1.0',
      toolVendor: 'Custom',
    },
  },
  {
    id: uuidv4(),
    title: 'Text Entry Question',
    qtiVersion: '3.0',
    itemBody: {
      elements: [],
      interactions: [
        {
          type: 'textEntry',
          prompt: 'What is 2 + 2?',
          correctResponses: ['4', 'four'],
          expectedLength: 10,
          placeholderText: 'Enter your answer',
        },
      ],
    },
    responseDeclarations: [],
    outcomeDeclarations: [],
    templateDeclarations: [],
    metadata: {
      itemTemplate: false,
      timeDependent: false,
      composite: false,
      interactionType: 'textEntry',
      feedbackType: 'none',
      solutionAvailable: true,
      scoringMode: 'automatic',
      toolName: 'QTI Editor',
      toolVersion: '1.0',
      toolVendor: 'Custom',
    },
  },
  {
    id: uuidv4(),
    title: 'Order Question',
    qtiVersion: '3.0',
    itemBody: {
      elements: [],
      interactions: [
        {
          type: 'order',
          prompt: 'Put these numbers in ascending order:',
          items: [
            { id: '1', content: '5' },
            { id: '2', content: '2' },
            { id: '3', content: '8' },
            { id: '4', content: '1' },
          ],
          correctOrder: ['4', '2', '1', '3'],
        },
      ],
    },
    responseDeclarations: [],
    outcomeDeclarations: [],
    templateDeclarations: [],
    metadata: {
      itemTemplate: false,
      timeDependent: false,
      composite: false,
      interactionType: 'order',
      feedbackType: 'none',
      solutionAvailable: true,
      scoringMode: 'automatic',
      toolName: 'QTI Editor',
      toolVersion: '1.0',
      toolVendor: 'Custom',
    },
  },
  {
    id: uuidv4(),
    title: 'Extended Text Question',
    qtiVersion: '3.0',
    itemBody: {
      elements: [],
      interactions: [
        {
          type: 'extendedText',
          prompt: 'Explain the process of photosynthesis:',
          format: 'plain',
          maxLength: 1000,
          minLength: 100,
          expectedLines: 10,
          placeholderText: 'Write your answer here...',
          sampleResponse: 'Photosynthesis is the process by which plants convert light energy into chemical energy...',
          rubric: [
            { score: 5, description: 'Complete and accurate explanation with examples' },
            { score: 3, description: 'Partial explanation with some key concepts missing' },
            { score: 1, description: 'Minimal or incorrect explanation' },
          ],
        },
      ],
    },
    responseDeclarations: [],
    outcomeDeclarations: [],
    templateDeclarations: [],
    metadata: {
      itemTemplate: false,
      timeDependent: false,
      composite: false,
      interactionType: 'extendedText',
      feedbackType: 'none',
      solutionAvailable: true,
      scoringMode: 'manual',
      toolName: 'QTI Editor',
      toolVersion: '1.0',
      toolVendor: 'Custom',
    },
  },
];

const initialState: QuestionBankState = {
  items: sampleQuestions,
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'questionBank/fetchItems',
  async (query?: string) => {
    const items = await api.searchAssessmentItems(query);
    return items;
  }
);

export const createItem = createAsyncThunk(
  'questionBank/createItem',
  async (qtiXml: string) => {
    const item = await api.createAssessmentItem(qtiXml);
    return item;
  }
);

export const updateItem = createAsyncThunk(
  'questionBank/updateItem',
  async (qtiXml: string) => {
    const item = await api.createAssessmentItem(qtiXml); // Using create since update not in API
    return item;
  }
);

export const deleteItem = createAsyncThunk(
  'questionBank/deleteItem',
  async (identifier: string) => {
    // API doesn't have delete endpoint, so just return the id
    return identifier;
  }
);

const questionBankSlice = createSlice({
  name: 'questionBank',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<AssessmentItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<AssessmentItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setItems: (state, action: PayloadAction<AssessmentItem[]>) => {
      state.items = action.payload;
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
      // Fetch items
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      // Create item
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create item';
      })
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item';
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete item';
      });
  },
});

export const {
  addItem,
  updateItem,
  deleteItem,
  setItems,
  setLoading,
  setError,
} = questionBankSlice.actions;

export type { QuestionBankState };
export default questionBankSlice.reducer; 