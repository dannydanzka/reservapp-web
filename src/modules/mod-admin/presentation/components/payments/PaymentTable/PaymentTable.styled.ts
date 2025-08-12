import styled from 'styled-components';

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EmptyStateContainer = styled.div`
  padding: 3rem;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  color: #9ca3af;
  height: 3rem;
  margin: 0 auto 1rem;
  width: 3rem;
`;

export const EmptyTitle = styled.h3`
  color: #111827;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const EmptyDescription = styled.p`
  color: #6b7280;
  margin: 0;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
`;

export const TableHeader = styled.thead`
  background: #f9fafb;
`;

export const TableHeaderRow = styled.tr``;

export const TableHeaderCell = styled.th<{ align?: 'left' | 'center' | 'right' }>`
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 0.75rem 1.5rem;
  text-align: ${({ align }) => align || 'left'};
  text-transform: uppercase;
`;

export const TableBody = styled.tbody`
  background: white;
`;

export const TableRow = styled.tr<{ isRefreshing?: boolean }>`
  border-bottom: 1px solid #e5e7eb;

  &:hover {
    background: #f9fafb;
  }

  ${({ isRefreshing }) =>
    isRefreshing &&
    `
    opacity: 0.5;
  `}
`;

export const TableCell = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
`;

export const PaymentInfoContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
`;

export const PaymentIcon = styled.div`
  flex-shrink: 0;

  svg {
    color: #9ca3af;
    height: 2rem;
    width: 2rem;
  }
`;

export const PaymentDetails = styled.div``;

export const PaymentId = styled.div`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ServiceName = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const PaymentMethod = styled.div`
  color: #9ca3af;
  font-size: 0.75rem;
`;

export const AmountCell = styled.div`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const CustomerInfo = styled.div``;

export const CustomerName = styled.div`
  color: #111827;
  font-size: 0.875rem;
`;

export const CustomerEmail = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const VenueName = styled.div`
  color: #111827;
  font-size: 0.875rem;
`;

export const DateText = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const ActionsCell = styled.td`
  font-size: 0.875rem;
  font-weight: 500;
  padding: 1rem 1.5rem;
  text-align: right;
  white-space: nowrap;
`;

export const ActionsContainer = styled.div`
  position: relative;
`;

export const ActionsMenu = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -2px rgb(0 0 0 / 0.05);
  margin-top: 0.25rem;
  position: absolute;
  right: 0;
  width: 12rem;
  z-index: 10;
`;

export const ActionsMenuContent = styled.div`
  padding: 0.25rem;
`;

export const ActionButton = styled.button<{ variant?: 'danger' | 'default' }>`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.375rem;

  &:hover {
    background: #f9fafb;
  }

  ${({ variant }) =>
    variant === 'danger'
      ? `
    color: #dc2626;
    
    &:hover {
      color: #b91c1c;
    }
  `
      : `
    color: #374151;
  `}
`;

export const PaginationContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const PaginationInfo = styled.div`
  color: #374151;
  font-size: 0.875rem;

  span {
    font-weight: 500;
  }
`;

export const PaginationControls = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const PaginationText = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const MenuOverlay = styled.div`
  inset: 0;
  position: fixed;
  z-index: 5;
`;
