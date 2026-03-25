import { render, screen } from '@testing-library/react';
import MainContainer from './MainContainer';
import React from 'react';

// Mocking the specific buttons to test the container's layout
jest.mock('./AzureArmstrongButton', () => () => <div data-testid="azure-armstrong">Azure</div>);
jest.mock('./GooglePrimeButton', () => () => <div data-testid="google-prime">Google</div>);
jest.mock('./AmazonFibonacciButton', () => () => <div data-testid="amazon-fibonacci">Amazon</div>);
jest.mock('@chakra-ui/react', () => ({
    Container: ({ children }) => <div>{children}</div>,
}));

describe('MainContainer', () => {
    test('renders all calculator buttons', () => {
        render(<MainContainer />);
        expect(screen.getByTestId('azure-armstrong')).toBeInTheDocument();
        expect(screen.getByTestId('google-prime')).toBeInTheDocument();
        expect(screen.getByTestId('amazon-fibonacci')).toBeInTheDocument();
    });
});
