import { useCallback, useState } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface UseLoadingStateReturn {
  isLoading: (key?: string) => boolean;
  isAnyLoading: boolean;
  setLoading: (key: string, loading: boolean) => void;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  withLoading: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T>;
  resetLoading: () => void;
  loadingStates: LoadingState;
}

export const useLoadingState = (initialStates: LoadingState = {}): UseLoadingStateReturn => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(initialStates);

  const isLoading = useCallback(
    (key: string = 'default'): boolean => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  const isAnyLoading = Object.values(loadingStates).some((loading) => loading);

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const startLoading = useCallback(
    (key: string) => {
      setLoading(key, true);
    },
    [setLoading]
  );

  const stopLoading = useCallback(
    (key: string) => {
      setLoading(key, false);
    },
    [setLoading]
  );

  const withLoading = useCallback(
    async <T>(key: string, asyncFn: () => Promise<T>): Promise<T> => {
      startLoading(key);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  const resetLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    isAnyLoading,
    isLoading,
    loadingStates,
    resetLoading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};
