import styled from 'styled-components';

export const PaymentDetailsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const PaymentDetailsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const PaymentDetailsGrid = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const PaymentDetailRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const PaymentDetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
`;

export const PaymentDetailValue = styled.span`
  font-family:
    Monaco,
    Menlo,
    Courier New,
    monospace;
  font-weight: 500;

  &.currency {
    font-family: inherit;
    font-weight: 500;
  }
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormLabel = styled.label`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[700]};
  display: flex;
  font-size: 0.875rem;
  font-weight: 500;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const NumberInputWrapper = styled.div`
  position: relative;
`;

export const NumberInput = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  transition: all 0.15s ease;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
    outline: none;
  }
`;

export const CurrencyIndicator = styled.div`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.875rem;
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  top: ${({ theme }) => theme.spacing[2]};
`;

export const AmountLimits = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  display: flex;
  font-size: 0.875rem;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: inherit;
  font-size: 1rem;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  resize: vertical;
  transition: all 0.15s ease;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
    outline: none;
  }
`;

export const WarningCard = styled.div<{ $type: 'warning' | 'info' }>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid;

  ${({ $type, theme }) => {
    if ($type === 'warning') {
      return `
        background-color: ${theme.colors.warning[50]};
        border-color: ${theme.colors.warning[200]};
      `;
    }
    return `
      background-color: ${theme.colors.primary[50]};
      border-color: ${theme.colors.primary[200]};
    `;
  }}
`;

export const WarningContent = styled.div`
  align-items: flex-start;
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const WarningIcon = styled.div<{ $type: 'warning' | 'info' }>`
  color: ${({ $type, theme }) =>
    $type === 'warning' ? theme.colors.warning[600] : theme.colors.primary[600]};
  height: 1.25rem;
  margin-top: 0.125rem;
  width: 1.25rem;
`;

export const WarningText = styled.div<{ $type: 'warning' | 'info' }>`
  color: ${({ $type, theme }) =>
    $type === 'warning' ? theme.colors.warning[800] : theme.colors.primary[800]};
  font-size: 0.875rem;
`;

export const WarningTitle = styled.p`
  font-weight: 500;
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

export const WarningDescription = styled.p`
  margin: 0;
`;

export const ErrorCard = styled.div`
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[3]};
`;

export const ErrorContent = styled.div`
  align-items: flex-start;
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ErrorIcon = styled.div`
  color: ${({ theme }) => theme.colors.error[600]};
  height: 1.25rem;
  margin-top: 0.125rem;
  width: 1.25rem;
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error[800]};
  font-size: 0.875rem;
  margin: 0;
`;

export const ActionsContainer = styled.div`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing[4]};
`;
