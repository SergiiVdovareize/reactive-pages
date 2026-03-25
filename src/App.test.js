import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calculator inputs', () => {
  render(<App />);
  const linkElement = screen.getByText(/Get Armstrong number/i);
  expect(linkElement).toBeInTheDocument();
});
