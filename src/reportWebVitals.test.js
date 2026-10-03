import reportWebVitals from './reportWebVitals';
import * as webVitals from 'web-vitals';

jest.mock('web-vitals', () => ({
  __esModule: true,
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe('reportWebVitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does nothing when no argument is passed', () => {
    expect(() => reportWebVitals()).not.toThrow();
    expect(webVitals.getCLS).not.toHaveBeenCalled();
  });

  test('does nothing when argument is not a function', () => {
    reportWebVitals('not-a-func');
    reportWebVitals(123);
    reportWebVitals({});
    expect(webVitals.getCLS).not.toHaveBeenCalled();
  });

  test('calls web-vitals functions when a callback function is provided', async () => {
    const mockPerfEntry = jest.fn();
    const onPerfEntry = (metric) => mockPerfEntry(metric);

    reportWebVitals(onPerfEntry);

    // Wait for promise tick
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(webVitals.getCLS).toHaveBeenCalledWith(onPerfEntry);
    expect(webVitals.getFID).toHaveBeenCalledWith(onPerfEntry);
    expect(webVitals.getFCP).toHaveBeenCalledWith(onPerfEntry);
    expect(webVitals.getLCP).toHaveBeenCalledWith(onPerfEntry);
    expect(webVitals.getTTFB).toHaveBeenCalledWith(onPerfEntry);
  });
});
