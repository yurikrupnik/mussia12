import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Index from '../pages/index';

const queryClient = new QueryClient();

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <QueryClientProvider client={queryClient}>
        <Index />
      </QueryClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
