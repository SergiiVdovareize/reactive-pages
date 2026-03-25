import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mocking Chakra UI components to avoid ESM issues in CRA's Jest
jest.mock('@chakra-ui/react', () => {
    return {
        ChakraProvider: ({ children }) => <>{children}</>,
        Center: ({ children }) => <div>{children}</div>,
        Container: ({ children }) => <div>{children}</div>,
        defaultSystem: {},
    };
});

// Mock the components that might use broken dependencies
jest.mock('./components/MainContainer', () => () => <div data-testid="main-container">MainContent</div>);

test('renders components and main container', () => {
  render(<App />);
  const logoElement = screen.getByAltText(/logo/i);
  expect(logoElement).toBeInTheDocument();
  
  const mainContainer = screen.getByTestId('main-container');
  expect(mainContainer).toBeInTheDocument();
});
