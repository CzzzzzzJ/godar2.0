import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B6455',
      light: '#6B8E7B',
      dark: '#2A3B30',
    },
    secondary: {
      main: '#E8EDE9',
      light: '#F5F7F5',
      dark: '#D1D8D3',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F7F5',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '8px 24px',
        },
      },
    },
  },
});

export default theme; 