import { styled } from 'styled-components';
import Link from 'next/link';

import { ButtonProps, PlanInfoProps, PlanPriceProps } from './UserRegisterPage.interfaces';

export const FormContainer = styled.div`
  margin: 0 auto;
  max-width: 400px;
  width: 100%;
`;

export const UserInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

export const UserInfoTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const UserInfoText = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FormGroup = styled.div`
  display: flex;
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
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  transition: all 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }
`;

export const Button = styled.button<ButtonProps>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: ${({ $isLoading }) => ($isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  ${({ $variant = 'primary', theme }) => {
    if ($variant === 'secondary') {
      return `
        background-color: ${theme.colors.secondary[200]};
        color: ${theme.colors.secondary[700]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary[300]};
        }
      `;
    }
    return `
      background-color: ${theme.colors.primary[600]};
      color: ${theme.colors.white};
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primary[700]};
      }
    `;
  }}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[2]};
  text-align: center;
`;

export const PasswordRequirements = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.75rem;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const LinkContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

export const AuthLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.875rem;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

export const PlanInfo = styled.div<PlanInfoProps>`
  background-color: ${({ $isPremium, theme }) =>
    $isPremium ? theme.colors.secondary[50] : theme.colors.primary[50]};
  border: 1px solid
    ${({ $isPremium, theme }) =>
      $isPremium ? theme.colors.secondary[200] : theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
`;

export const PlanTitle = styled.h5`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const PlanDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.875rem;
  margin: 0;
`;

export const PlanPrice = styled.div<PlanPriceProps>`
  color: ${({ $isPremium, theme }) =>
    $isPremium ? theme.colors.secondary[600] : theme.colors.primary[600]};
  font-size: 1.125rem;
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;
