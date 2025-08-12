import React, { createContext, useContext, useState } from 'react';

interface ScreenLoaderContextValue {
  isLoading: boolean;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const ScreenLoaderContext = createContext<ScreenLoaderContextValue | undefined>(undefined);

interface ScreenLoaderProviderProps {
  children: React.ReactNode;
}

export const ScreenLoaderProvider: React.FC<ScreenLoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

  const showLoader = (message?: string) => {
    setIsLoading(true);
    setLoadingMessage(message);
  };

  const hideLoader = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  const contextValue: ScreenLoaderContextValue = {
    hideLoader,
    isLoading,
    showLoader,
  };

  return (
    <ScreenLoaderContext.Provider value={contextValue}>
      {children}
      {isLoading && <div>{/* Implementar el screen loader aquí */}</div>}
    </ScreenLoaderContext.Provider>
  );
};

export const useScreenLoader = (): ScreenLoaderContextValue => {
  const context = useContext(ScreenLoaderContext);
  if (context === undefined) {
    throw new Error('useScreenLoader must be used within a ScreenLoaderProvider');
  }
  return context;
};
