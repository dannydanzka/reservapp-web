import styled from 'styled-components';

interface TableRowProps {
  $isRead?: boolean;
}

interface NotificationTitleProps {
  $isRead?: boolean;
}

interface StatusBadgeProps {
  $isRead?: boolean;
}

interface BulkActionButtonProps {
  variant: 'primary' | 'secondary';
}

export const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 1rem;
  margin: 0;
`;

export const FiltersSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const SearchInput = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing[3]};
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FilterSelect = styled.select`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  min-width: 180px;
  padding: ${({ theme }) => theme.spacing[3]};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }
`;

export const ClearFiltersButton = styled.button`
  align-self: flex-start;
  background: ${({ theme }) => theme.colors.secondary[100]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.secondary[700]};
  cursor: pointer;
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};

  &:hover {
    background: ${({ theme }) => theme.colors.secondary[200]};
  }
`;

export const BulkActionsBar = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-items: stretch;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const BulkActionsInfo = styled.span`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-weight: 500;
`;

export const BulkActionsButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const BulkActionButton = styled.button<BulkActionButtonProps>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;

  ${({ theme, variant }) =>
    variant === 'primary'
      ? `
        background: ${theme.colors.primary[600]};
        color: white;
        
        &:hover {
          background: ${theme.colors.primary[700]};
        }
      `
      : `
        background: white;
        color: ${theme.colors.secondary[700]};
        border: 1px solid ${theme.colors.secondary[300]};
        
        &:hover {
          background: ${theme.colors.secondary[50]};
        }
      `}
`;

export const Content = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

export const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[12]};
`;

export const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin: 0;
`;

export const EmptyState = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

export const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

export const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin: 0;
  max-width: 400px;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.secondary[50]};
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<TableRowProps>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  ${({ $isRead, theme }) =>
    !$isRead &&
    `
      background: ${theme.colors.primary[50]};
    `}

  &:hover {
    background: ${({ $isRead, theme }) =>
      $isRead ? theme.colors.secondary[50] : theme.colors.primary[100]};
  }
`;

export const TableHeaderCell = styled.th`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  text-transform: uppercase;
`;

export const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[4]};
  vertical-align: top;
`;

export const Checkbox = styled.input`
  cursor: pointer;
  height: 16px;
  width: 16px;
`;

export const NotificationTypeChip = styled.span<{ type: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ theme, type }) => {
    // User and Business registrations - Green (success)
    if (type.includes('USER_REGISTERED') || type.includes('BUSINESS_REGISTERED')) {
      return `
        background: ${theme.colors.success[100]};
        color: ${theme.colors.success[800]};
        border: 1px solid ${theme.colors.success[200]};
      `;
    }
    // Reservation confirmations - Blue (primary)
    if (type.includes('RESERVATION_CONFIRMATION')) {
      return `
        background: ${theme.colors.primary[100]};
        color: ${theme.colors.primary[800]};
        border: 1px solid ${theme.colors.primary[200]};
      `;
    }
    // Reservation created - Light blue
    if (type.includes('RESERVATION_CREATED')) {
      return `
        background: ${theme.colors.primary[50]};
        color: ${theme.colors.primary[700]};
        border: 1px solid ${theme.colors.primary[200]};
      `;
    }
    // Reservation cancelled - Red (error)
    if (type.includes('RESERVATION_CANCELLED')) {
      return `
        background: ${theme.colors.error[100]};
        color: ${theme.colors.error[800]};
        border: 1px solid ${theme.colors.error[200]};
      `;
    }
    // Payment received - Green (success)
    if (type.includes('PAYMENT_RECEIVED')) {
      return `
        background: ${theme.colors.success[100]};
        color: ${theme.colors.success[800]};
        border: 1px solid ${theme.colors.success[200]};
      `;
    }
    // Payment failed - Red (error)
    if (type.includes('PAYMENT_FAILED')) {
      return `
        background: ${theme.colors.error[100]};
        color: ${theme.colors.error[800]};
        border: 1px solid ${theme.colors.error[200]};
      `;
    }
    // Contact forms - Orange (secondary)
    if (type.includes('CONTACT')) {
      return `
        background: ${theme.colors.secondary[100]};
        color: ${theme.colors.secondary[800]};
        border: 1px solid ${theme.colors.secondary[200]};
      `;
    }
    // Venue/Service created - Yellow (warning)
    if (type.includes('VENUE_CREATED') || type.includes('SERVICE_CREATED')) {
      return `
        background: ${theme.colors.warning[100]};
        color: ${theme.colors.warning[800]};
        border: 1px solid ${theme.colors.warning[200]};
      `;
    }
    // System alerts - Gray
    if (type.includes('SYSTEM_ALERT')) {
      return `
        background: ${theme.colors.gray[100]};
        color: ${theme.colors.gray[800]};
        border: 1px solid ${theme.colors.gray[300]};
      `;
    }
    // Default - Gray
    return `
      background: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[700]};
      border: 1px solid ${theme.colors.gray[300]};
    `;
  }}
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const NotificationTitle = styled.div<NotificationTitleProps>`
  color: ${({ $isRead, theme }) =>
    $isRead ? theme.colors.secondary[700] : theme.colors.secondary[900]};
  font-size: 0.875rem;
  font-weight: ${({ $isRead }) => ($isRead ? '500' : '600')};
`;

export const NotificationMessage = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  line-height: 1.4;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const UserName = styled.div`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const UserEmail = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.75rem;
`;

export const DateInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

export const StatusBadge = styled.span<StatusBadgeProps>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${({ $isRead, theme }) =>
    $isRead
      ? `
        background: ${theme.colors.success[100]};
        color: ${theme.colors.success[800]};
        border-color: ${theme.colors.success[300]};
      `
      : `
        background: ${theme.colors.warning[100]};
        color: ${theme.colors.warning[800]};
        border-color: ${theme.colors.warning[300]};
        animation: pulse 2s infinite;
      `}

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.7;
    }
  }
`;

export const NoData = styled.span`
  color: ${({ theme }) => theme.colors.secondary[400]};
  font-style: italic;
`;

export const PaginationContainer = styled.div`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-items: stretch;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

export const PaginationControls = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    justify-content: center;
  }
`;

export const PaginationButton = styled.button`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.secondary[700]};
  cursor: pointer;
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary[50]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const PageInfo = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  font-weight: 500;
`;
