import React, { FC, ReactElement, useMemo } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  Theme,
  createTheme,
} from '@mui/material';
// import theme from '../../src/theme';

interface Props {
  theme?: Partial<Theme>;
  children: ReactElement;
}

const ThemeProvider: FC<Props> = (props: Props) => {
  const { children, theme } = props;
  const _theme = useMemo(() => {
    return createTheme(theme);
  }, [theme]);
  return <MuiThemeProvider theme={_theme}>{children}</MuiThemeProvider>;
};

ThemeProvider.defaultProps = {
  theme: createTheme({}),
};

export default ThemeProvider;
