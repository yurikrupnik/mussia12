import createCache from '@emotion/cache';

import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export function createEmotionCache() {
  return createCache({ key: 'css' });
}

// Create a theme instance.
export const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});
