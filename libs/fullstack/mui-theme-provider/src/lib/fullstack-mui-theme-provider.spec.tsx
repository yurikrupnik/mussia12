import { render } from '@testing-library/react';

import FullstackMuiThemeProvider from './fullstack-mui-theme-provider';

describe('FullstackMuiThemeProvider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FullstackMuiThemeProvider theme={{}}>
        <div>hello</div>
      </FullstackMuiThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
