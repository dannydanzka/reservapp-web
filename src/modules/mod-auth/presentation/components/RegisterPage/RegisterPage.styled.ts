import { styled } from 'styled-components';
import Link from 'next/link';

import { ButtonProps, PackageCardProps, StepProps } from './RegisterPage.interfaces';

export const FormContainer = styled.div`
  width: 100%;
`;

export const StepIndicator = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const Step = styled.div<StepProps>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;

  ${({ $isActive, $isCompleted, theme }) => {
    if ($isCompleted) {
      return `
        background-color: ${theme.colors.success[100]};
        color: ${theme.colors.success[700]};
      `;
    }
    if ($isActive) {
      return `
        background-color: ${theme.colors.primary[100]};
        color: ${theme.colors.primary[700]};
      `;
    }
    return `
      background-color: transparent;
      color: ${theme.colors.secondary[500]};
    `;
  }}
`;

export const StepSeparator = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[200]};
  height: 2px;
  margin: 0 ${({ theme }) => theme.spacing[2]};
  width: ${({ theme }) => theme.spacing[8]};
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

export const Textarea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: inherit;
  font-size: 1rem;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  resize: vertical;
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

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
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

export const BusinessInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const BusinessInfoTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const BusinessInfoText = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const PricingCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: ${({ theme }) => theme.spacing[4]} 0;
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

export const PricingAmount = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const PricingPeriod = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const PricingFeatures = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
`;

export const PricingFeature = styled.li`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[1]} 0;

  &::before {
    color: ${({ theme }) => theme.colors.success[500]};
    content: '✓';
    font-weight: bold;
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
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

export const PaymentContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

export const PackageSelector = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const PackageCard = styled.div<PackageCardProps>`
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary[500] : theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 8px 25px rgb(0 0 0 / 0.1);
    transform: translateY(-2px);
  }

  ${({ $selected, theme }) =>
    $selected &&
    `
    background-color: ${theme.colors.primary[50]};
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15);
  `}
`;

export const PopularBadge = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  left: 50%;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  position: absolute;
  text-transform: uppercase;
  top: -10px;
  transform: translateX(-50%);
`;

export const PackageName = styled.h4`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const PackagePrice = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const PackagePeriod = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const PackageFeaturesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
`;

export const PackageFeature = styled.li`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[700]};
  display: flex;
  font-size: 0.875rem;
  padding: ${({ theme }) => theme.spacing[1]} 0;

  &::before {
    color: ${({ theme }) => theme.colors.success[500]};
    content: '✓';
    flex-shrink: 0;
    font-weight: bold;
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

export const PackageSelectorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;
