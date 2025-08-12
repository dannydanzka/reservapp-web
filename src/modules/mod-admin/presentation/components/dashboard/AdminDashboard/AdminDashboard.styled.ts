import styled from 'styled-components';

export const DashboardContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: ${({ theme }) => theme.spacing[6]};

  @media (width <= 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 1.125rem;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing[10]};
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -1px rgb(0 0 0 / 0.06);
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const StatChange = styled.div<{ $isPositive: boolean }>`
  color: ${({ $isPositive, theme }) =>
    $isPositive ? theme.colors.success[600] : theme.colors.error[600]};
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const ContentGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
  grid-template-columns: 2fr 1fr;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -1px rgb(0 0 0 / 0.06);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const RecentItem = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[100]};
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} 0;

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemInfo = styled.div``;

export const ItemTitle = styled.div`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const ItemSubtitle = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

export const StatusBadge = styled.span<{ $status: 'confirmed' | 'pending' | 'cancelled' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'confirmed':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'pending':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'cancelled':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

export const QuickAction = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary[700]};
  cursor: pointer;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  transition: all 0.15s ease;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[100]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 1rem;
  margin: 0;
  padding: ${({ theme }) => theme.spacing[8]} 0;
  text-align: center;
`;
