import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6',        // owl.accent / primary
      dark: '#1E3A8A',        // owl.primaryDark
    },
    background: {
      default: '#111C2D',     // owl.background
      paper: '#0F172A',       // owl.surface
    },
    text: {
      primary: '#F1F5F9',     // owl.text
      secondary: '#94A3B8',   // owl.secondaryText
    },
    divider: '#334155',       // owl.border
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#334155', // owl.border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6', // owl.accent
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6', // owl.accent
          },
        },
        input: {
          color: '#F1F5F9', // owl.text
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#94A3B8', // owl.secondaryText
          '&.Mui-focused': {
            color: '#3B82F6', // owl.accent
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  }

});

export default muiTheme;
