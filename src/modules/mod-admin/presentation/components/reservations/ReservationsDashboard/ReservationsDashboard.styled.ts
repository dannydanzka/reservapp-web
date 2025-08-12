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
  min-height: 24rem;
`;

export const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  border-bottom: 2px solid #2563eb;
  border-radius: 9999px;
  height: 2rem;
  width: 2rem;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

export const HeaderSection = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const HeaderTitle = styled.h1`
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const ExportButton = styled.button`
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  color: #374151;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;

  &:hover {
    background: #f9fafb;
  }

  svg {
    height: 1rem;
    margin-right: 0.5rem;
    width: 1rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;

  @media (width >= 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px 0 rgb(0 0 0 / 0.06);
  padding: 1.5rem;
`;

export const StatContent = styled.div`
  align-items: center;
  display: flex;
`;

export const StatIcon = styled.div<{ color?: string }>`
  color: ${({ color }) => color || '#2563eb'};
  height: 2rem;
  width: 2rem;
`;

export const StatInfo = styled.div`
  margin-left: 1rem;
`;

export const StatLabel = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
`;

export const StatValue = styled.p`
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

export const FiltersCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px 0 rgb(0 0 0 / 0.06);
  padding: 1.5rem;
`;

export const FiltersGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (width >= 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

export const FilterField = styled.div``;

export const FilterLabel = styled.label`
  color: #374151;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const FilterSelect = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  width: 100%;

  &:focus {
    border-color: transparent;
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
  }
`;

export const FilterInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  width: 100%;

  &:focus {
    border-color: transparent;
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
  }
`;

export const SearchInputContainer = styled.div`
  position: relative;
`;

export const SearchIcon = styled.div`
  color: #9ca3af;
  height: 1rem;
  left: 0.75rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
`;

export const SearchInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  width: 100%;

  &:focus {
    border-color: transparent;
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
  }
`;

export const TableCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px 0 rgb(0 0 0 / 0.06);
  overflow: hidden;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  min-width: 100%;
`;

export const TableHeader = styled.thead`
  background: #f9fafb;
`;

export const TableHeaderRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeaderCell = styled.th`
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 0.75rem 1.5rem;
  text-align: left;
  text-transform: uppercase;
`;

export const TableBody = styled.tbody`
  background: white;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:hover {
    background: #f9fafb;
  }
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
`;

export const TableCellMedium = styled(TableCell)`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const UserInfo = styled.div`
  align-items: center;
  display: flex;
`;

export const UserIcon = styled.div`
  color: #9ca3af;
  height: 1rem;
  margin-right: 0.5rem;
  width: 1rem;
`;

export const UserDetails = styled.div``;

export const UserName = styled.div`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const UserEmail = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const ServiceInfo = styled.div`
  align-items: center;
  display: flex;
`;

export const BuildingIcon = styled.div`
  color: #9ca3af;
  height: 1rem;
  margin-right: 0.5rem;
  width: 1rem;
`;

export const ServiceDetails = styled.div``;

export const ServiceName = styled.div`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const VenueName = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const DateInfo = styled.div`
  color: #111827;
  font-size: 0.875rem;
`;

export const StatusBadge = styled.span<{ $statusType: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  ${({ $statusType }) => {
    switch ($statusType) {
      case 'PENDING':
        return 'color: #d97706; background-color: #fef3c7;';
      case 'CONFIRMED':
        return 'color: #059669; background-color: #d1fae5;';
      case 'CHECKED_IN':
        return 'color: #2563eb; background-color: #dbeafe;';
      case 'CHECKED_OUT':
        return 'color: #6b7280; background-color: #f3f4f6;';
      case 'CANCELLED':
        return 'color: #dc2626; background-color: #fee2e2;';
      case 'NO_SHOW':
        return 'color: #dc2626; background-color: #fee2e2;';
      case 'COMPLETED':
        return 'color: #059669; background-color: #d1fae5;';
      case 'FAILED':
        return 'color: #dc2626; background-color: #fee2e2;';
      case 'PROCESSING':
        return 'color: #2563eb; background-color: #dbeafe;';
      case 'REFUNDED':
        return 'color: #7c3aed; background-color: #ede9fe;';
      default:
        return 'color: #6b7280; background-color: #f3f4f6;';
    }
  }}
`;

export const PaymentStatus = styled.div`
  margin-bottom: 0.25rem;
`;

export const AmountCell = styled(TableCell)`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ActionsCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StatusSelect = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
`;

export const VerifyButton = styled.button`
  background: #3b82f6;
  border: none;
  border-radius: 0.25rem;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;

  &:hover {
    background: #2563eb;
  }
`;

export const PaginationContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const MobilePagination = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;

  @media (width >= 640px) {
    display: none;
  }
`;

export const DesktopPagination = styled.div`
  display: none;

  @media (width >= 640px) {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: space-between;
  }
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: #374151;
  background: white;

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  &:hover:not(:disabled) {
    background: #f9fafb;
  }
`;

export const PaginationInfo = styled.p`
  color: #374151;
  font-size: 0.875rem;
  margin: 0;

  span {
    font-weight: 500;
  }
`;

export const PaginationNav = styled.nav`
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: inline-flex;
  margin-left: -1px;
  position: relative;
  z-index: 0;
`;

export const PaginationNavButton = styled.button<{
  disabled?: boolean;
  position?: 'left' | 'right';
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;

  ${({ position }) =>
    position === 'left' &&
    `
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  `}

  ${({ position }) =>
    position === 'right' &&
    `
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
  `}
  
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}
  
  &:hover:not(:disabled) {
    background: #f9fafb;
  }
`;
