import { act, renderHook } from '@testing-library/react';

import { useLoadingState } from '../useLoadingState';

describe('useLoadingState Hook', () => {
  test('should initialize with empty loading states', () => {
    const { result } = renderHook(() => useLoadingState());

    expect(result.current.loadingStates).toEqual({});
    expect(result.current.isLoading('any-key')).toBe(false);
  });

  test('should start and stop loading for specific keys', () => {
    const { result } = renderHook(() => useLoadingState());

    act(() => {
      result.current.startLoading('test-key');
    });

    expect(result.current.isLoading('test-key')).toBe(true);
    expect(result.current.loadingStates['test-key']).toBe(true);

    act(() => {
      result.current.stopLoading('test-key');
    });

    expect(result.current.isLoading('test-key')).toBe(false);
  });

  test('should handle multiple loading states', () => {
    const { result } = renderHook(() => useLoadingState());

    act(() => {
      result.current.startLoading('key1');
      result.current.startLoading('key2');
    });

    expect(result.current.isLoading('key1')).toBe(true);
    expect(result.current.isLoading('key2')).toBe(true);
    expect(result.current.isLoading('key3')).toBe(false);
  });

  test('should execute async functions with loading state', async () => {
    const { result } = renderHook(() => useLoadingState());

    const mockAsyncFn = jest.fn().mockResolvedValue('success');

    await act(async () => {
      const response = await result.current.withLoading('test-key', mockAsyncFn);
      expect(response).toBe('success');
    });

    expect(mockAsyncFn).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading('test-key')).toBe(false);
  });
});
