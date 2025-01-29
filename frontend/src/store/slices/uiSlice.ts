import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface UiState {
  drawerOpen: boolean;
  snackbar: SnackbarState;
}

const initialState: UiState = {
  drawerOpen: false,
  snackbar: {
    open: false,
    message: '',
    severity: 'info'
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setDrawer: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    showSnackbar: (state, action: PayloadAction<Omit<SnackbarState, 'open'>>) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    }
  }
});

export const { toggleDrawer, setDrawer, showSnackbar, hideSnackbar } = uiSlice.actions;

export default uiSlice.reducer; 