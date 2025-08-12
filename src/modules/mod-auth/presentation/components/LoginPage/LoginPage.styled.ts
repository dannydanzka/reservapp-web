import { styled } from 'styled-components';
import Link from 'next/link';

import { SubmitButtonProps } from './LoginPage.interfaces';

export const FormContainer = styled.div`
  width: 100%;
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

export const SubmitButton = styled.button<SubmitButtonProps>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary[600]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.white};
  cursor: ${({ $isLoading }) => ($isLoading ? 'not-allowed' : 'pointer')};
  display: flex;
  font-size: 1rem;
  font-weight: 500;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary[700]};
  }

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

export const DemoCredentials = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const DemoTitle = styled.h4`
  color: ${({ theme }) => theme.colors.secondary[800]};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const DemoItem = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const BusinessInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

export const BusinessInfoTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const BusinessInfoText = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.75rem;
  line-height: 1.4;
  margin-bottom: 0;
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
