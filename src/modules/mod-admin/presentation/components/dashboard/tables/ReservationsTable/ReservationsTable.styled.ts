import styled from 'styled-components';

export const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -1px rgb(0 0 0 / 0.06);
  overflow: hidden;
`;

export const TableHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const TableTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

export const TableSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  margin: 0;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[100]};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[25]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const TableCell = styled.td`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  vertical-align: middle;
  white-space: nowrap;
`;

export const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0.5]};
`;

export const CustomerName = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 500;
`;

export const CustomerEmail = styled.span`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.75rem;
`;

export const VenueInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0.5]};
  max-width: 150px;
`;

export const VenueName = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 500;
`;

export const ServiceName = styled.span`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.75rem;
`;

export const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0.5]};
`;

export const DateText = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 500;
`;

export const TimeText = styled.span`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.75rem;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  background-color: ${({ $status, theme }) => {
    switch ($status) {
      case 'confirmed':
        return theme.colors.success[100];
      case 'pending':
        return theme.colors.warning[100];
      case 'cancelled':
        return theme.colors.error[100];
      default:
        return theme.colors.secondary[100];
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'confirmed':
        return theme.colors.success[700];
      case 'pending':
        return theme.colors.warning[700];
      case 'cancelled':
        return theme.colors.error[700];
      default:
        return theme.colors.secondary[700];
    }
  }};
  font-size: 0.75rem;
  font-weight: 500;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2.5]}`};
  white-space: nowrap;
`;

export const AmountText = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 600;
`;

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing[8]};
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
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing[8]};
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
