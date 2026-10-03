import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
    Input: React.forwardRef(({ placeholder, onKeyDown, value, onChange, disabled, ...rest }, ref) => (
      <input ref={ref} placeholder={placeholder} onKeyDown={onKeyDown} value={value} onChange={onChange} disabled={disabled} {...rest} />
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
    resultPlaceholder: 'Result for _index_: _result_',
  };

  beforeEach(() => {
    mockCalculate.mockClear();
    jest.useRealTimers();
  });

  test('renders with correct label and placeholder', () => {
    render(<CloudButton {...defaultProps} />);
    expect(screen.getByText(/Test Label/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Test Placeholder/i)).toBeInTheDocument();
  });

  test('renders default input placeholder when not specified', () => {
    const { inputPlaceholder, ...propsWithoutPlaceholder } = defaultProps;
    render(<CloudButton {...propsWithoutPlaceholder} />);
    expect(screen.getByPlaceholderText('Enter index')).toBeInTheDocument();
  });

  test('calls calculate when button is clicked', async () => {
    mockCalculate.mockResolvedValue({ success: true, data: '42', calculationTime: 10 });
    
    render(<CloudButton {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Test Placeholder/i);
    const button = screen.getByRole('button', { name: /calc/i });

    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCalculate).toHaveBeenCalledWith('5');
    });
    
    const resultElement = await screen.findByText(/Result for 5/i);
    expect(resultElement).toBeInTheDocument();
    expect(screen.getByText(/42/i)).toBeInTheDocument();
    expect(screen.getByText(/calculation time is 10ms/i)).toBeInTheDocument();
  });

  test('triggers calculate when Enter key is pressed', async () => {
    mockCalculate.mockResolvedValue({ success: true, data: '99' });

    render(<CloudButton {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Test Placeholder/i);
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.keyDown(input, { keyCode: 13 });

    await waitFor(() => {
      expect(mockCalculate).toHaveBeenCalledWith('7');
    });
    expect(await screen.findByText(/Result for 7/i)).toBeInTheDocument();
  });

  test('does not trigger calculate when a non-Enter key is pressed', () => {
    render(<CloudButton {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Test Placeholder/i);
    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.keyDown(input, { keyCode: 65 });

    expect(mockCalculate).not.toHaveBeenCalled();
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

  test('displays fallback "unknown issue" when calculation fails without message', async () => {
    mockCalculate.mockResolvedValue({ success: false });

    render(<CloudButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /calc/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unknown issue/i);
    });
  });

  test('prevents concurrent submissions while calculation is in progress', async () => {
    let resolveCalc;
    mockCalculate.mockImplementation(() => new Promise((resolve) => {
      resolveCalc = resolve;
    }));

    render(<CloudButton {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Test Placeholder/i);
    const button = screen.getByRole('button', { name: /calc/i });

    fireEvent.change(input, { target: { value: '3' } });
    fireEvent.click(button);

    expect(mockCalculate).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
    expect(input).toBeDisabled();

    // Secondary click or enter key should be ignored
    fireEvent.click(button);
    fireEvent.keyDown(input, { keyCode: 13 });
    expect(mockCalculate).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveCalc({ success: true, data: '8' });
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  test('restores focus to input element after calculation completes', async () => {
    jest.useFakeTimers();
    mockCalculate.mockResolvedValue({ success: true, data: '10' });

    render(<CloudButton {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Test Placeholder/i);
    const button = screen.getByRole('button', { name: /calc/i });

    const focusSpy = jest.spyOn(input, 'focus');

    // Simulate focus on external button
    button.focus();

    await act(async () => {
      fireEvent.click(button);
    });

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });

  test('does not schedule focus restoration if input is already active element', async () => {
    jest.useFakeTimers();
    mockCalculate.mockResolvedValue({ success: true, data: '10' });

    render(<CloudButton {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Test Placeholder/i);
    const focusSpy = jest.spyOn(input, 'focus');

    // Focus on the input itself (has data-index="true")
    input.focus();

    await act(async () => {
      fireEvent.keyDown(input, { keyCode: 13 });
    });

    jest.advanceTimersByTime(150);

    // Should only have been called once by the manual input.focus() above
    expect(focusSpy).toHaveBeenCalledTimes(1);
    focusSpy.mockRestore();
  });
});
