import { render } from '@testing-library/react';

import SharedFeMuiTheme1 from './shared-fe-mui-theme1';

describe('SharedFeMuiTheme1', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedFeMuiTheme1 />);
    expect(baseElement).toBeTruthy();
  });
});
