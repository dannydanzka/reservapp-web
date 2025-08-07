import styled from 'styled-components';

export const StyledPaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 auto;
  max-width: 400px;
  width: 100%;
`;

export const StyledCardContainer = styled.div`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: border-color 0.2s ease;

  &:focus-within {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgb(139 92 246 / 0.2);
  }

  .StripeElement {
    height: 20px;
    padding: 10px 0;
  }

  .StripeElement--focus {
    outline: none;
  }

  .StripeElement--invalid {
    border-color: #ef4444;
  }

  .StripeElement--webkit-autofill {
    background-color: #f9fafb;
  }
`;

export const StyledErrorMessage = styled.div`
  background-color: rgb(239 68 68 / 0.1);
  border: 1px solid rgb(239 68 68 / 0.3);
  border-radius: 0.375rem;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem;
  text-align: center;
`;

export const StyledSuccessMessage = styled.div`
  background-color: rgb(16 185 129 / 0.1);
  border: 1px solid rgb(16 185 129 / 0.3);
  border-radius: 0.5rem;
  color: #10b981;
  font-size: 1rem;
  font-weight: 500;
  padding: 1rem;
  text-align: center;
`;

export const StyledAmountDisplay = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: center;
`;

export const StyledPaymentDetails = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
`;

export const StyledPaymentDetailRow = styled.div`
  align-items: center;
  color: #6b7280;
  display: flex;
  font-size: 0.875rem;
  justify-content: space-between;

  &:last-child {
    border-top: 1px solid #e5e7eb;
    color: #1f2937;
    font-weight: 600;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
`;

export const StyledSecurityNotice = styled.div`
  border-top: 1px solid #e5e7eb;
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 1rem;
  padding: 0.5rem;
  text-align: center;

  &::before {
    content: '🔒';
    margin-right: 0.5rem;
  }
`;
