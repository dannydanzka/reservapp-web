/**
 * Loading state HOC based on Jafra's loading patterns.
 * Provides loading state management for components.
 */

import React, { ComponentType } from 'react';

import styled from 'styled-components';

import { ScreenLoader } from '@ui/ScreenLoader';
import { useUI } from '@presentation/hooks';

interface WithLoadingOptions {
  /**
   * Custom loading component
   */
  loadingComponent?: ComponentType<{ message?: string }>;

  /**
   * Loading message to display
   */
  loadingMessage?: string;

  /**
   * Component identifier for loading state
   */
  componentId?: string;

  /**
   * Whether to use global loading state
   * @default false
   */
  useGlobalLoading?: boolean;

  /**
   * Custom loading condition function
   */
  isLoading?: () => boolean;

  /**
   * Minimum loading time in milliseconds
   * @default 0
   */
  minLoadingTime?: number;
}

const LoadingWrapper = styled.div`
  position: relative;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingOverlay = styled.div<{ isFullscreen?: boolean }>`
  ${({ isFullscreen }) =>
    isFullscreen
      ? `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  `
      : `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `}

  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  text-align: center;
`;

/**
 * Default loading component
 */
const DefaultLoadingComponent: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingWrapper>
    <div>
      <ScreenLoader />
      {message && <LoadingMessage>{message}</LoadingMessage>}
    </div>
  </LoadingWrapper>
);

/**
 * Higher-Order Component that adds loading state management to a component.
 * @param WrappedComponent - The component to wrap
 * @param options - Configuration options for loading behavior
 */
export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithLoadingOptions = {}
) {
  const {
    componentId,
    isLoading,
    loadingComponent: LoadingComponent = DefaultLoadingComponent,
    loadingMessage,
    minLoadingTime = 0,
    useGlobalLoading = false,
  } = options;

  const WithLoadingComponent: React.FC<P> = (props) => {
    const { isComponentLoading, isGlobalLoading } = useUI();

    const [minTimeElapsed, setMinTimeElapsed] = React.useState(minLoadingTime === 0);

    React.useEffect(() => {
      if (minLoadingTime > 0) {
        const timer = setTimeout(() => {
          setMinTimeElapsed(true);
        }, minLoadingTime);

        return () => clearTimeout(timer);
      }
    }, [minLoadingTime]);

    // Determine loading state
    let loading = false;

    if (isLoading) {
      loading = isLoading();
    } else if (useGlobalLoading) {
      loading = isGlobalLoading;
    } else if (componentId) {
      loading = isComponentLoading(componentId);
    }

    // Respect minimum loading time
    if (!minTimeElapsed) {
      loading = true;
    }

    if (loading) {
      return <LoadingComponent message={loadingMessage} />;
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  WithLoadingComponent.displayName = `withLoading(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithLoadingComponent;
}

/**
 * HOC for components that should show global loading state
 */
export const withGlobalLoading = <P extends object>(
  WrappedComponent: ComponentType<P>,
  loadingMessage?: string
) =>
  withLoading(WrappedComponent, {
    loadingMessage,
    useGlobalLoading: true,
  });

/**
 * HOC for components with component-specific loading state
 */
export const withComponentLoading = <P extends object>(
  WrappedComponent: ComponentType<P>,
  componentId: string,
  loadingMessage?: string
) =>
  withLoading(WrappedComponent, {
    componentId,
    loadingMessage,
  });

/**
 * HOC that shows an overlay loading state
 */
export function withLoadingOverlay<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithLoadingOptions & { isFullscreen?: boolean } = {}
) {
  const {
    componentId,
    isFullscreen = false,
    isLoading,
    loadingComponent: LoadingComponent = ScreenLoader,
    loadingMessage,
    useGlobalLoading = false,
  } = options;

  const WithLoadingOverlayComponent: React.FC<P> = (props) => {
    const { isComponentLoading, isGlobalLoading } = useUI();

    // Determine loading state
    let loading = false;

    if (isLoading) {
      loading = isLoading();
    } else if (useGlobalLoading) {
      loading = isGlobalLoading;
    } else if (componentId) {
      loading = isComponentLoading(componentId);
    }

    return (
      <div style={{ position: 'relative' }}>
        <WrappedComponent {...props} />
        {loading && (
          <LoadingOverlay isFullscreen={isFullscreen}>
            <div>
              <LoadingComponent />
              {loadingMessage && <LoadingMessage>{loadingMessage}</LoadingMessage>}
            </div>
          </LoadingOverlay>
        )}
      </div>
    );
  };

  // Set display name for debugging
  WithLoadingOverlayComponent.displayName = `withLoadingOverlay(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithLoadingOverlayComponent;
}

export default withLoading;
