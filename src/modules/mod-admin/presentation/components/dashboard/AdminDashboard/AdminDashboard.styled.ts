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

export const ChartsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
  grid-template-columns: 1fr 1fr;
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const TablesGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
  grid-template-columns: 1.25fr 1fr;

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

// Componentes para estados vacíos motivacionales
export const EmptyStateContainer = styled.div`
  align-items: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[50]} 0%,
    ${({ theme }) => theme.colors.secondary[50]} 100%
  );
  border: 2px dashed ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primary[400]};
  display: flex;
  height: 80px;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  width: 80px;
`;

export const EmptyStateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const EmptyStateDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  max-width: 300px;
`;

export const EmptyStateButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[600]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
    box-shadow: 0 8px 16px rgb(0 0 0 / 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StepsContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const StepItem = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[700]};
  display: flex;
  font-size: 0.875rem;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[2]};
`;

export const StepNumber = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primary[700]};
  display: flex;
  font-size: 0.75rem;
  font-weight: 600;
  height: 24px;
  justify-content: center;
  width: 24px;
`;

// New styled components for reservation and venue items
export const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const ReservationCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
`;

export const ReservationName = styled.div`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const ReservationDetails = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

export const DetailRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[0.5]};

  svg {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }
`;

export const StatusContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

export const StatusTag = styled.span<{ $status: string }>`
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case 'confirmed':
        return theme.colors.success[500];
      case 'pending':
        return theme.colors.warning[500];
      case 'cancelled':
        return theme.colors.error[500];
      default:
        return theme.colors.secondary[500];
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  padding: ${({ theme }) => `${theme.spacing[0.5]} ${theme.spacing[2]}`};
`;

export const VenueCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
`;

export const VenueName = styled.div`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const VenueDetails = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

export const VenueCategory = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const VenueStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const LoadingContainer = styled(DashboardContainer)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 400px;
`;

export const ErrorContainer = styled(DashboardContainer)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 400px;
`;

export const ErrorMessage = styled(Subtitle)`
  color: ${({ theme }) => theme.colors.error[600]};
`;
