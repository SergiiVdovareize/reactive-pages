import { render, screen, fireEvent } from '@testing-library/react';
import AzureArmstrongButton from './AzureArmstrongButton';
import GooglePrimeButton from './GooglePrimeButton';
import AmazonFibonacciButton from './AmazonFibonacciButton';
import CloudService from '../utils/CloudService';
import React from 'react';

jest.mock('./CloudButton', () => {
    return function MockCloudButton(props) {
        return (
            <div data-testid="cloud-button">
                <span data-testid="label">{props.label}</span>
                <span data-testid="placeholder">{props.inputPlaceholder}</span>
                <span data-testid="result-placeholder">{props.resultPlaceholder}</span>
                <button data-testid="mock-calc-btn" onClick={() => props.calculate && props.calculate('42')}>Calc</button>
            </div>
        );
    };
});

describe('Specific Service Buttons', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('AzureArmstrongButton renders correctly with proper props', () => {
        const spy = jest.spyOn(CloudService, 'getArmstrongNumber').mockResolvedValue({ success: true });
        render(<AzureArmstrongButton />);
        expect(screen.getByTestId('label')).toHaveTextContent(/Azure Functions/i);
        expect(screen.getByTestId('label')).toHaveTextContent(/Armstrong/i);
        expect(screen.getByTestId('placeholder')).toHaveTextContent(/Enter index between 1 and 25/i);
        expect(screen.getByTestId('result-placeholder')).toHaveTextContent(/armstrong number of _index_ is/i);

        fireEvent.click(screen.getByTestId('mock-calc-btn'));
        expect(spy).toHaveBeenCalledWith('42');
    });

    test('GooglePrimeButton renders correctly with proper props', () => {
        const spy = jest.spyOn(CloudService, 'getPrimeNumber').mockResolvedValue({ success: true });
        render(<GooglePrimeButton />);
        expect(screen.getByTestId('label')).toHaveTextContent(/Google Cloud Functions/i);
        expect(screen.getByTestId('label')).toHaveTextContent(/Prime/i);
        expect(screen.getByTestId('placeholder')).toHaveTextContent(/Enter index between 1 and 1000000/i);
        expect(screen.getByTestId('result-placeholder')).toHaveTextContent(/prime number of _index_ is/i);

        fireEvent.click(screen.getByTestId('mock-calc-btn'));
        expect(spy).toHaveBeenCalledWith('42');
    });

    test('AmazonFibonacciButton renders correctly with proper props', () => {
        const spy = jest.spyOn(CloudService, 'getFibonacciNumber').mockResolvedValue({ success: true });
        render(<AmazonFibonacciButton />);
        expect(screen.getByTestId('label')).toHaveTextContent(/AWS Lambda/i);
        expect(screen.getByTestId('label')).toHaveTextContent(/Fibonacci/i);
        expect(screen.getByTestId('placeholder')).toHaveTextContent(/Enter index between 1 and 300/i);
        expect(screen.getByTestId('result-placeholder')).toHaveTextContent(/fibonacci number of _index_ is/i);

        fireEvent.click(screen.getByTestId('mock-calc-btn'));
        expect(spy).toHaveBeenCalledWith('42');
    });
});
