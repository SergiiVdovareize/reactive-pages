import { render, screen } from '@testing-library/react';
import AzureArmstrongButton from './AzureArmstrongButton';
import GooglePrimeButton from './GooglePrimeButton';
import AmazonFibonacciButton from './AmazonFibonacciButton';
import React from 'react';

// Mock the generic CloudButton to simplify tests
jest.mock('./CloudButton', () => (props) => (
    <div data-testid="cloud-button">
        <span data-testid="label">{props.label}</span>
        <span data-testid="placeholder">{props.inputPlaceholder}</span>
    </div>
));

describe('Specific Service Buttons', () => {
    test('AzureArmstrongButton renders correctly', () => {
        render(<AzureArmstrongButton />);
        expect(screen.getByTestId('label')).toHaveTextContent(/Azure/i);
        expect(screen.getByTestId('label')).toHaveTextContent(/Armstrong/i);
    });

    test('GooglePrimeButton renders correctly', () => {
        render(<GooglePrimeButton />);
        expect(screen.getByTestId('label')).toHaveTextContent(/Google/i);
        expect(screen.getByTestId('label')).toHaveTextContent(/Prime/i);
    });

    test('AmazonFibonacciButton renders correctly', () => {
        render(<AmazonFibonacciButton />);
        expect(screen.getByTestId('label')).toHaveTextContent(/AWS/i);
        expect(screen.getByTestId('label')).toHaveTextContent(/Fibonacci/i);
    });
});
