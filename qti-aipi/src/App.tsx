import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QTIPackageManager } from './components/QTIPackageManager';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QTIPackageManager />
    </ThemeProvider>
  );
}

export default App;
