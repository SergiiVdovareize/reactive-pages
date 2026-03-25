import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CloudButton from './CloudButton';
import React from 'react';

// Mocking Chakra UI components to avoid ESM issues in CRA's Jest
jest.mock('@chakra-ui/react', () => {
  const React = require('react');
  return {
    ChakraProvider: ({ children }) => <>{children}</>,
    Box: ({ children }) => <div>{children}</div>,
    Button: ({ children, onClick, loading }) => (
      <button onClick={onClick} disabled={loading}>{loading ? 'Loading...' : children}</button>
    ),
    Field: {
        Root: ({ children }) => <div>{children}</div>,
        Label: ({ children }) => <label>{children}</label>,
        ErrorText: ({ children }) => <div role="alert">{children}</div>,
        HelperText: ({ children }) => <div>{children}</div>,
    },
    Group: ({ children }) => <div>{children}</div>,
    Input: React.forwardRef(({ placeholder, onKeyDown, value, onChange }, ref) => (
      <input ref={ref} placeholder={placeholder} onKeyDown={onKeyDown} value={value} onChange={onChange} />
    )),
    Text: ({ children }) => <span>{children}</span>,
    defaultSystem: {},
  };
});

describe('CloudButton', () => {
  const mockCalculate = jest.fn();
  const defaultProps = {
    calculate: mockCalculate,
    label: 'Test Label',
    inputPlaceholder: 'Test Placeholder',
    resultPlaceholder: 'Result for _index_: _result_', // Slightly updated if needed
  };

  beforeEach(() => {
    mockCalculate.mockClear();
  });

  test('renders with correct label and placeholder', () => {
    render(<CloudButton {...defaultProps} />);
    expect(screen.getByText(/Test Label/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Test Placeholder/i)).toBeInTheDocument();
  });

  test('calls calculate when button is clicked', async () => {
    mockCalculate.mockResolvedValue({ success: true, data: '42', calculationTime: 10 });
    
    render(<CloudButton {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Test Placeholder/i);
    const button = screen.getByRole('button', { name: /calc/i });

    // Directly setting the value and triggering the click
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCalculate).toHaveBeenCalledWith('5');
    });
    
    // Wait for the result to appear and the loading state to finish
    const resultElement = await screen.findByText(/Result for 5/i);
    expect(resultElement).toBeInTheDocument();
    expect(screen.getByText(/42/i)).toBeInTheDocument();
  });

  test('displays error message when calculation fails', async () => {
    mockCalculate.mockResolvedValue({ success: false, message: 'Server error' });

    render(<CloudButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /calc/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Server error/i);
    });
  });
});
