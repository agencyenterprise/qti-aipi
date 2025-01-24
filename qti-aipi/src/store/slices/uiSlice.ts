import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  notifications: Notification[];
  currentModal: string | null;
  loading: {
    [key: string]: boolean;
  };
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

const initialState: UIState = {
  darkMode: false,
  sidebarOpen: true,
  notifications: [],
  currentModal: null,
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setCurrentModal: (state, action: PayloadAction<string | null>) => {
      state.currentModal = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  toggleDarkMode,
  setSidebarOpen,
  addNotification,
  removeNotification,
  setCurrentModal,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer; 