import styled from 'styled-components';

import {
  ActionButtonVariant,
  ButtonVariant,
  StatusBadgeStatus,
} from './ServicesManagement.interfaces';

export const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

export const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    align-items: stretch;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const Button = styled.button<{ $variant?: ButtonVariant; disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  ${({ $variant = 'primary', theme }) =>
    $variant === 'primary'
      ? `
        background-color: ${theme.colors.primary[600]};
        color: white;
        
        &:hover {
          background-color: ${theme.colors.primary[700]};
        }
      `
      : `
        background-color: white;
        color: ${theme.colors.secondary[700]};
        border: 1px solid ${theme.colors.secondary[300]};
        
        &:hover {
          background-color: ${theme.colors.secondary[50]};
        }
      `}
`;

export const Filters = styled.div`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[500]};
    outline: none;
  }
`;

export const Select = styled.select`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[500]};
    outline: none;
  }
`;

export const Table = styled.table`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
  width: 100%;
`;

export const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
  }
`;

export const TableHeaderCell = styled.th`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 0.875rem;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  text-align: left;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  }
`;

export const TableCell = styled.td`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  }
`;

export const StatusBadge = styled.span<{ $status: StatusBadgeStatus }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;

  ${({ $status, theme }) =>
    $status
      ? `
        background-color: ${theme.colors.success[100]};
        color: ${theme.colors.success[800]};
      `
      : `
        background-color: ${theme.colors.error[100]};
        color: ${theme.colors.error[800]};
      `}
`;

export const CategoryBadge = styled.span<{ $category: string }>`
  background-color: ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 0.75rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
`;

export const ActionButton = styled.button<{ $variant?: ActionButtonVariant }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s ease;
  margin-right: ${({ theme }) => theme.spacing[2]};

  ${({ $variant = 'edit', theme }) => {
    switch ($variant) {
      case 'edit':
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
          &:hover {
            background-color: ${theme.colors.primary[200]};
          }
        `;
      case 'delete':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
          &:hover {
            background-color: ${theme.colors.error[200]};
          }
        `;
      case 'toggle':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
          &:hover {
            background-color: ${theme.colors.warning[200]};
          }
        `;
      default:
        return '';
    }
  }}
`;

export const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.secondary[500]};
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
`;

export const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const Pagination = styled.div`
  align-items: center;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  justify-content: between;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const PaginationInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const PaginationButton = styled.button<{ disabled?: boolean }>`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.secondary[700]};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 0.875rem;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
  }
`;
