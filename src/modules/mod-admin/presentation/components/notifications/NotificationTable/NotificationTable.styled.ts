import styled, { css } from 'styled-components';

import { Button } from '@ui/Button';

export const TableContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  overflow: hidden;
`;

export const TableWrapper = styled.div`
  min-height: 400px;
  overflow-x: auto;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const TableHeader = styled.thead`
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const TableHeaderRow = styled.tr``;

export const TableHeaderCell = styled.th<{ align?: 'left' | 'center' | 'right' }>`
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  text-align: ${(props) => props.align || 'left'};
  white-space: nowrap;

  &:first-child {
    width: 40px; /* Checkbox column */
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr<{ isRefreshing?: boolean; isSelected?: boolean }>`
  border-bottom: 1px solid #f3f4f6;

  ${(props) =>
    props.isSelected &&
    css`
      background: #f0f9ff;
    `}

  &:hover {
    background: ${(props) => (props.isSelected ? '#e0f2fe' : '#f9fafb')};
  }

  ${(props) =>
    props.isRefreshing &&
    css`
      opacity: 0.6;
      pointer-events: none;
    `}
`;

export const TableCell = styled.td`
  font-size: 14px;
  padding: 16px;
  vertical-align: top;
`;

export const CheckboxCell = styled(TableCell)`
  padding: 16px 12px;
  width: 40px;
`;

export const Checkbox = styled.input`
  accent-color: #3b82f6;
  cursor: pointer;
  height: 16px;
  width: 16px;
`;

export const NotificationCell = styled(TableCell)`
  min-width: 300px;
`;

export const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const NotificationTitle = styled.div<{ isRead: boolean }>`
  color: ${(props) => (props.isRead ? '#6b7280' : '#111827')};
  font-weight: ${(props) => (props.isRead ? '500' : '700')};
  line-height: 1.4;
`;

export const NotificationMessage = styled.div<{ isRead: boolean }>`
  color: ${(props) => (props.isRead ? '#9ca3af' : '#6b7280')};
  font-size: 13px;
  line-height: 1.4;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NotificationMeta = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  margin-top: 4px;
`;

export const TypeBadge = styled.span<{ type: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;

  ${(props) => {
    switch (props.type) {
      case 'USER_REGISTERED':
        return css`
          background: #dbeafe;
          color: #1d4ed8;
        `;
      case 'BUSINESS_REGISTERED':
        return css`
          background: #d1fae5;
          color: #047857;
        `;
      case 'RESERVATION_CREATED':
        return css`
          background: #fef3c7;
          color: #92400e;
        `;
      case 'RESERVATION_CANCELLED':
        return css`
          background: #fee2e2;
          color: #dc2626;
        `;
      case 'PAYMENT_RECEIVED':
        return css`
          background: #d1fae5;
          color: #047857;
        `;
      case 'PAYMENT_FAILED':
        return css`
          background: #fee2e2;
          color: #dc2626;
        `;
      case 'CONTACT_FORM':
        return css`
          background: #e0e7ff;
          color: #3730a3;
        `;
      default:
        return css`
          background: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

export const EmailIndicator = styled.span<{ emailSent: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;

  ${(props) =>
    props.emailSent
      ? css`
          background: #dcfce7;
          color: #166534;
        `
      : css`
          background: #f1f5f9;
          color: #64748b;
        `}
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserName = styled.div<{ isRead: boolean }>`
  color: ${(props) => (props.isRead ? '#6b7280' : '#111827')};
  font-weight: ${(props) => (props.isRead ? '500' : '600')};
`;

export const UserEmail = styled.div`
  color: #9ca3af;
  font-size: 12px;
`;

export const VenueInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const VenueName = styled.div<{ isRead: boolean }>`
  color: ${(props) => (props.isRead ? '#6b7280' : '#111827')};
  font-weight: ${(props) => (props.isRead ? '500' : '600')};
`;

export const VenueCategory = styled.div`
  color: #9ca3af;
  font-size: 12px;
  text-transform: capitalize;
`;

export const DateCell = styled(TableCell)`
  min-width: 120px;
`;

export const DateText = styled.div<{ isRead: boolean }>`
  color: ${(props) => (props.isRead ? '#9ca3af' : '#6b7280')};
  font-size: 13px;
`;

export const ActionsCell = styled(TableCell)`
  text-align: right;
  width: 120px;
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  position: relative;
`;

export const ActionButton = styled(Button)`
  font-size: 12px;
  padding: 6px 12px;
`;

export const ActionsMenu = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  min-width: 160px;
  padding: 4px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 10;
`;

export const ActionsMenuContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const MenuOverlay = styled.div`
  inset: 0;
  position: fixed;
  z-index: 5;
`;

export const BulkActionsBar = styled.div`
  align-items: center;
  background: #f0f9ff;
  border-bottom: 1px solid #e0f2fe;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
`;

export const BulkActionsLeft = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
`;

export const BulkActionsText = styled.span`
  color: #0369a1;
  font-size: 14px;
  font-weight: 500;
`;

export const BulkActionsRight = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`;

export const PaginationContainer = styled.div`
  align-items: center;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  padding: 16px;
`;

export const PaginationInfo = styled.div`
  color: #6b7280;
  font-size: 14px;

  span {
    color: #111827;
    font-weight: 600;
  }
`;

export const PaginationControls = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
`;

export const PaginationText = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

export const EmptyStateContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  color: #d1d5db;
  height: 64px;
  margin-bottom: 16px;
  width: 64px;

  svg {
    height: 100%;
    width: 100%;
  }
`;

export const EmptyTitle = styled.h3`
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

export const EmptyDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  max-width: 400px;
`;
