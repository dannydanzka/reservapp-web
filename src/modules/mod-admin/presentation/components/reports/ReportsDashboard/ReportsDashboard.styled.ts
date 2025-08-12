import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

export const RefreshButton = styled.button`
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
    grid-template-columns: repeat(4, 1fr);
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

export const TemplatesSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px 0 rgb(0 0 0 / 0.06);
  padding: 1.5rem;
`;

export const TemplatesTitle = styled.h2`
  color: #111827;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const TemplatesGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (width >= 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const TemplateCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #93c5fd;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -1px rgb(0 0 0 / 0.06);
  }
`;

export const TemplateHeader = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 0.75rem;
`;

export const TemplateIcon = styled.div`
  color: #2563eb;
  height: 1.5rem;
  width: 1.5rem;
`;

export const TemplateName = styled.h3`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0;
  margin-left: 0.75rem;
`;

export const TemplateDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

export const TemplateFooter = styled.div`
  align-items: center;
  color: #6b7280;
  display: flex;
  font-size: 0.75rem;
  justify-content: space-between;
`;

export const TemplateTime = styled.span``;

export const TemplateButton = styled.span`
  align-items: center;
  background: #dbeafe;
  border-radius: 9999px;
  color: #1e40af;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.625rem;
`;

export const ReportsSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px 0 rgb(0 0 0 / 0.06);
  overflow: hidden;
`;

export const ReportsHeader = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
`;

export const ReportsTitle = styled.h2`
  color: #111827;
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
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

export const ReportInfo = styled.div`
  align-items: center;
  display: flex;
`;

export const ReportIcon = styled.div`
  color: #9ca3af;
  height: 1.25rem;
  margin-right: 0.75rem;
  width: 1.25rem;
`;

export const ReportDetails = styled.div``;

export const ReportName = styled.div`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ReportAuthor = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  ${({ $status }) => {
    switch ($status) {
      case 'COMPLETED':
        return 'color: #059669; background-color: #d1fae5;';
      case 'GENERATING':
        return 'color: #d97706; background-color: #fef3c7;';
      case 'PENDING':
        return 'color: #6b7280; background-color: #f3f4f6;';
      case 'FAILED':
        return 'color: #dc2626; background-color: #fee2e2;';
      default:
        return 'color: #6b7280; background-color: #f3f4f6;';
    }
  }}

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;

    ${({ $status }) =>
      $status === 'GENERATING' &&
      `
      animation: spin 1s linear infinite;
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}
  }
`;

export const DateCell = styled.td`
  color: #111827;
  font-size: 0.875rem;
  padding: 1rem 1.5rem;
  white-space: nowrap;
`;

export const FormatBadge = styled.span`
  align-items: center;
  background: #f3f4f6;
  border-radius: 9999px;
  color: #111827;
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.625rem;
`;

export const SizeCell = styled.td`
  color: #6b7280;
  font-size: 0.875rem;
  padding: 1rem 1.5rem;
  white-space: nowrap;
`;

export const ActionsCell = styled.td`
  font-size: 0.875rem;
  font-weight: 500;
  padding: 1rem 1.5rem;
  white-space: nowrap;
`;

export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    color: #2563eb;
    &:hover {
      color: #1d4ed8;
    }
  `
      : `
    color: #059669;
    &:hover {
      color: #047857;
    }
  `}

  svg {
    height: 1rem;
    margin-right: 0.25rem;
    width: 1rem;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Modal Styles
export const ModalOverlay = styled.div`
  background: rgb(75 85 99 / 0.5);
  height: 100%;
  inset: 0;
  overflow-y: auto;
  position: fixed;
  width: 100%;
  z-index: 50;
`;

export const ModalContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 10px 10px -5px rgb(0 0 0 / 0.04);
  margin: 0 auto;
  padding: 1.25rem;
  position: relative;
  top: 5rem;
  width: 24rem;
`;

export const ModalContent = styled.div`
  margin-top: 0.75rem;
`;

export const ModalTitle = styled.h3`
  color: #111827;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormField = styled.div``;

export const FormLabel = styled.label`
  color: #374151;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const FormInput = styled.input`
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

export const FormSelect = styled.select`
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

export const CheckboxField = styled.div`
  align-items: center;
  display: flex;
`;

export const CheckboxInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  color: #2563eb;
  height: 1rem;
  width: 1rem;

  &:focus {
    ring-color: #3b82f6;
  }
`;

export const CheckboxLabel = styled.label`
  color: #111827;
  display: block;
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

export const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;

  ${({ variant }) =>
    variant === 'primary'
      ? `
    color: white;
    background: #2563eb;
    
    &:hover {
      background: #1d4ed8;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
      : `
    color: #374151;
    background: #f3f4f6;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`;
