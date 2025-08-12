import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 16rem;
`;

export const HeaderSection = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderTitle = styled.h1`
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

export const HeaderSubtitle = styled.p`
  color: #4b5563;
  margin-bottom: 0;
  margin-top: 0.25rem;
`;

export const HeaderActions = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
`;

export const RefreshIcon = styled.div<{ isRefreshing?: boolean }>`
  width: 1rem;
  height: 1rem;

  ${({ isRefreshing }) =>
    isRefreshing &&
    `
    animation: spin 1s linear infinite;
  `}

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

export const FiltersCard = styled.div`
  padding: 1.5rem;
`;

export const TableCard = styled.div`
  overflow: hidden;
`;
