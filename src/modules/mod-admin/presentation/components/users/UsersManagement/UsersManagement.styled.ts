import styled from 'styled-components';

import { UserRoleEnum as UserRole } from '@prisma/client';

import { ActionButtonVariant, ButtonVariant } from './UsersManagement.interfaces';

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
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary[700]};
    }
  `
      : `
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary[700]};
    border: 1px solid ${theme.colors.secondary[300]};
    
    &:hover:not(:disabled) {
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

export const UsersGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const UserCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -1px rgb(0 0 0 / 0.06);
  padding: ${({ theme }) => theme.spacing[6]};
  transition: transform 0.15s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

export const UserHeader = styled.div`
  align-items: flex-start;
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const UserAvatar = styled.div`
  align-items: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[400]},
    ${({ theme }) => theme.colors.primary[600]}
  );
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-shrink: 0;
  font-size: 1.125rem;
  font-weight: 700;
  height: 50px;
  justify-content: center;
  width: 50px;
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

export const UserEmail = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  word-break: break-all;
`;

export const UserPhone = styled.div`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: auto;
  flex-shrink: 0;

  ${({ $isActive, theme }) =>
    $isActive
      ? `
    background-color: ${theme.colors.success[100]};
    color: ${theme.colors.success[700]};
  `
      : `
    background-color: ${theme.colors.error[100]};
    color: ${theme.colors.error[700]};
  `}
`;

export const UserDetails = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const DetailRow = styled.div`
  align-items: center;
  display: flex;
  font-size: 0.875rem;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
`;

export const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-family: monospace;
  font-weight: 500;
  text-align: right;
`;

export const RoleBadge = styled.span<{ $role: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ $role, theme }) => {
    switch ($role) {
      case 'ADMIN':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case 'MANAGER':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'EMPLOYEE':
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      case 'USER':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

export const UserActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ActionButton = styled.button<{ $variant?: ActionButtonVariant }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'danger':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
          
          &:hover {
            background-color: ${theme.colors.error[200]};
          }
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
          
          &:hover {
            background-color: ${theme.colors.warning[200]};
          }
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
          
          &:hover {
            background-color: ${theme.colors.success[200]};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
          
          &:hover {
            background-color: ${theme.colors.primary[200]};
          }
        `;
    }
  }}
`;

export const ErrorContainer = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const NoUsersMessage = styled.div`
  background: ${({ theme }) => theme.colors.secondary[50]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  grid-column: 1 / -1;
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;

  p {
    color: ${({ theme }) => theme.colors.secondary[600]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

export const PaginationContainer = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

export const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;
