import CloudService from './CloudService';
import Constants from './Constants';

describe('CloudService', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getResult', () => {
        test('successfully returns sync data', async () => {
            const mockResponse = {
                type: 'sync',
                data: { success: true, result: 42 }
            };
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await CloudService.getFibonacciNumber(5);
            expect(fetch).toHaveBeenCalledWith(`${Constants.FIBONACCI_URL}/5`);
            expect(result).toEqual(mockResponse.data);
        });

        test('handles fetch errors', async () => {
            fetch.mockRejectedValueOnce(new Error('Network failure'));

            const result = await CloudService.getArmstrongNumber(1);
            expect(result).toEqual({
                success: false,
                message: 'Network failure'
            });
        });

        test('handles server issues with specific error message', async () => {
            const mockResponse = {
                type: 'error',
                message: 'Index too large'
            };
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await CloudService.getPrimeNumber(999999);
            expect(result).toEqual({
                success: false,
                message: 'Index too large'
            });
        });

        test('handles async results by polling correctly', async () => {
            // First hit to start calculation
            const mockStartResponse = {
                type: 'async',
                data: 'token_123'
            };
            // Second hit (poll) says "not ready yet"
            const mockPoll1Response = {
                success: false,
                status: 2
            };
            // Third hit (poll) says "success"
            const mockPoll2Response = {
                success: true,
                data: 144
            };

            fetch
                .mockResolvedValueOnce({ json: () => Promise.resolve(mockStartResponse) })
                .mockResolvedValueOnce({ json: () => Promise.resolve(mockPoll1Response) })
                .mockResolvedValueOnce({ json: () => Promise.resolve(mockPoll2Response) });

            const result = await CloudService.getFibonacciNumber(12);
            
            expect(fetch).toHaveBeenCalledTimes(3);
            expect(fetch).toHaveBeenNthCalledWith(1, `${Constants.FIBONACCI_URL}/12`);
            expect(fetch).toHaveBeenNthCalledWith(2, `${Constants.RESULT_URL}/token_123`);
            expect(fetch).toHaveBeenNthCalledWith(3, `${Constants.RESULT_URL}/token_123`);
            expect(result).toEqual(mockPoll2Response);
        });

        test('handles async polling failure with default error message', async () => {
            const mockStartResponse = {
                type: 'async',
                data: 'token_failed'
            };
            const mockPollFailed = {
                success: false,
                status: 3
            };

            fetch
                .mockResolvedValueOnce({ json: () => Promise.resolve(mockStartResponse) })
                .mockResolvedValueOnce({ json: () => Promise.resolve(mockPollFailed) });

            const result = await CloudService.getFibonacciNumber(10);
            expect(result).toEqual({
                success: false,
                message: 'unknown issue'
            });
        });

        test('handles network error during async polling', async () => {
            const mockStartResponse = {
                type: 'async',
                data: 'token_network_err'
            };

            fetch
                .mockResolvedValueOnce({ json: () => Promise.resolve(mockStartResponse) })
                .mockRejectedValueOnce(new Error('Poll timeout'));

            const result = await CloudService.getFibonacciNumber(10);
            expect(result).toEqual({
                success: false,
                message: 'Poll timeout'
            });
        });

        test('handles unknown response type without message with default error', async () => {
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve({})
            });

            const result = await CloudService.getFibonacciNumber(1);
            expect(result).toEqual({
                success: false,
                message: 'unknown issue'
            });
        });

        test('getPrimeNumber calls correct PRIME_URL', async () => {
            const mockResponse = {
                type: 'sync',
                data: { success: true, result: 7 }
            };
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await CloudService.getPrimeNumber(4);
            expect(fetch).toHaveBeenCalledWith(`${Constants.PRIME_URL}/4`);
            expect(result).toEqual(mockResponse.data);
        });

        test('getArmstrongNumber calls correct ARMSTRONG_URL', async () => {
            const mockResponse = {
                type: 'sync',
                data: { success: true, result: 153 }
            };
            fetch.mockResolvedValueOnce({
                json: () => Promise.resolve(mockResponse)
            });

            const result = await CloudService.getArmstrongNumber(10);
            expect(fetch).toHaveBeenCalledWith(`${Constants.ARMSTRONG_URL}/10`);
            expect(result).toEqual(mockResponse.data);
        });
    });
});
