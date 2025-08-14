import { styled } from 'styled-components';

export const PageContainer = styled.div`
  margin-bottom: 3rem;
  min-height: 100vh;
`;

export const PageHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: 3rem;
  padding: 4rem 2rem;
  position: relative;
  text-align: center;
`;

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.1);

  @media (width <= 768px) {
    font-size: 2rem;
  }
`;

export const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 1.25rem;
  margin: 0 auto;
  max-width: 600px;
`;

export const ContactContainer = styled.div`
  display: grid;
  gap: 4rem;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 2rem;

  @media (width <= 768px) {
    gap: 2rem;
    grid-template-columns: 1fr;
  }
`;

export const ContactForm = styled.form`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.08);
  padding: 2rem;
`;

export const FormTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const FormLabel = styled.label`
  color: ${({ theme }) => theme.colors.primary[700]};
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const TextArea = styled.textarea`
  border: 2px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  min-height: 120px;
  padding: 0.75rem;
  resize: vertical;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    outline: none;
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.08);
  padding: 2rem;
`;

export const InfoTitle = styled.h3`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary[900]};
  display: flex;
  font-size: 1.25rem;
  font-weight: 600;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const InfoItem = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoIcon = styled.span`
  font-size: 1.25rem;
  margin-top: 0.125rem;
`;

export const InfoText = styled.div`
  flex: 1;
`;

export const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

export const InfoValue = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.4;
`;

export const SuccessMessage = styled.div`
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px;
  color: #155724;
  margin-bottom: 1rem;
  padding: 1rem;
`;

export const ErrorMessage = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #721c24;
  margin-bottom: 1rem;
  padding: 1rem;
`;

export const SupportType = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
`;

export const SupportTitle = styled.div`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const SupportHours = styled.div`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 0.9rem;
`;
