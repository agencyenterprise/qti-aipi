import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  open: boolean;
}

interface UiState {
  snackbar: SnackbarState;
}

const initialState: UiState = {
  snackbar: {
    message: '',
    severity: 'info',
    open: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; severity: SnackbarState['severity'] }>
    ) => {
      state.snackbar = {
        message: action.payload.message,
        severity: action.payload.severity,
        open: true,
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer; 