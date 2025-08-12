import styled from 'styled-components';

import { ButtonVariant } from './VenuesManagement.interfaces';

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

export const VenuesGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
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

export const NoVenuesMessage = styled.div`
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

export const StatsContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

export const StatValue = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
`;
