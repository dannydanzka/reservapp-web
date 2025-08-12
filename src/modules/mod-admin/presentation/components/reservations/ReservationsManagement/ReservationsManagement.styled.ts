import styled from 'styled-components';

import { ActionButtonVariant, StatusColorVariant } from './ReservationsManagement.interfaces';

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

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    
    &:hover {
      background-color: ${theme.colors.primary[700]};
    }
  `
      : `
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary[700]};
    border: 1px solid ${theme.colors.secondary[300]};
    
    &:hover {
      background-color: ${theme.colors.secondary[50]};
    }
  `}
`;

export const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const FilterGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const Select = styled.select`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    outline: none;
  }
`;

export const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    outline: none;
  }
`;

export const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
`;

export const TableHeader = styled.th`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  text-align: left;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
  }
`;

export const TableCell = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[100]};
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
`;

export const StatusBadge = styled.span<{ $status: StatusColorVariant }>`
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
      case 'completed':
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

export const ActionButton = styled.button<{ $variant?: ActionButtonVariant }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  margin: 0 ${({ theme }) => theme.spacing[1]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $variant, theme }) =>
    $variant === 'delete'
      ? `
    background-color: ${theme.colors.error[100]};
    color: ${theme.colors.error[700]};
    
    &:hover {
      background-color: ${theme.colors.error[200]};
    }
  `
      : `
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
    
    &:hover {
      background-color: ${theme.colors.primary[200]};
    }
  `}
`;
