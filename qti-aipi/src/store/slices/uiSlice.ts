import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  currentView: 'dashboard' | 'assessment-editor' | 'question-bank' | 'preview';
  activeModal: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  sidebarOpen: true,
  currentView: 'dashboard',
  activeModal: null,
  notifications: [],
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentView: (state, action: PayloadAction<UiState['currentView']>) => {
      state.currentView = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id'>>) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setTheme: (state, action: PayloadAction<UiState['theme']>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setCurrentView,
  setActiveModal,
  addNotification,
  removeNotification,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 