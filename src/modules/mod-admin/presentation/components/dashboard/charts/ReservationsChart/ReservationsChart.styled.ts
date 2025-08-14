import styled from 'styled-components';

export const ChartContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -1px rgb(0 0 0 / 0.06);
  overflow: hidden;
`;

export const ChartHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const ChartTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

export const ChartSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  margin: 0;
`;

export const ChartContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 300px;
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin: 0;
`;

export const EmptyStateContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  color: ${({ theme }) => theme.colors.secondary[400]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const EmptyStateTitle = styled.h4`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

export const EmptyStateDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.875rem;
  margin: 0;
  max-width: 300px;
`;

export const LegendContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const LegendItem = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const LegendColor = styled.div<{ $color: string }>`
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
  height: 12px;
  width: 12px;
`;

export const LegendLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 500;
`;
