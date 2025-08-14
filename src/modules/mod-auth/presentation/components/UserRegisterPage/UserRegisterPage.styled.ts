import { styled } from 'styled-components';

// Reutilizamos los componentes principales de LandingPage
export {
  HeroButtons,
  HeroSection,
  HeroSubtitle,
  HeroTitle,
  LandingContainer,
  MobileAppShowcase,
  MobileScreenshotWrapper,
  ScreenshotImage,
} from '@mod-landing/presentation/components/LandingPage/LandingPage.styled';

// Componentes específicos para UserRegister
export const ValuePropContainer = styled.div`
  align-items: center;
  display: grid;
  gap: 4rem;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto;
  max-width: 1200px;

  @media (width <= 968px) {
    gap: 3rem;
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const StatsSection = styled.div`
  margin: 2rem 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);

  @media (width <= 768px) {
    gap: 0.5rem;
    grid-template-columns: 1fr;
  }
`;

export const StatsCard = styled.div`
  background: rgb(255 255 255 / 0.9);
  border: 2px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
`;

export const StatsNumber = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-family: Montserrat, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

export const StatsText = styled.div`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.3;
`;

export const FormSection = styled.section`
  background: ${({ theme }) => theme.colors.primary[25]};
  padding: 4rem 2rem;
`;

export const FormContainer = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 20px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 0.15);
  margin: 0 auto;
  max-width: 600px;
  padding: 3rem 2.5rem;
  position: relative;

  &::before {
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.primary[500]} 0%,
      ${({ theme }) => theme.colors.secondary[500]} 100%
    );
    border-radius: 20px;
    content: '';
    inset: -3px;
    opacity: 0.1;
    position: absolute;
    z-index: -1;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormRow = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 1fr;

  @media (width <= 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-family: Montserrat, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

export const Input = styled.input`
  background: ${({ theme }) => theme.colors.primary[25]};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 12px;
  font-family: Lato, sans-serif;
  font-size: 1rem;
  padding: 1.25rem 1rem;
  transition: all 0.3s ease;

  &:focus {
    background: white;
    border-color: ${({ theme }) => theme.colors.secondary[500]};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.secondary[100]};
    outline: none;
    transform: translateY(-2px);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary[400]};
    font-style: italic;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary[50]};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  border: 2px solid ${({ theme }) => theme.colors.error[300]};
  border-left: 4px solid ${({ theme }) => theme.colors.error[500]};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.error[700]};
  font-family: Montserrat, sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 1.25rem;
  position: relative;
  text-align: left;

  &::before {
    content: '⚠️';
    margin-right: 0.5rem;
  }
`;

// Styled components para reemplazar estilos inline
export const FormTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-family: Montserrat, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  text-align: center;
`;

export const FormSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 2rem;
  text-align: center;
`;

export const LinkContainer = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.primary[100]};
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
`;

export const LinkText = styled.span`
  color: ${({ theme }) => theme.colors.primary[600]};
  display: block;
  font-family: Lato, sans-serif;
  font-size: 0.95rem;
  margin: 1rem 0;
`;

export const StyledLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary[600]};
  cursor: pointer;
  font-family: Montserrat, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0;
  text-decoration: underline;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration-color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.secondary[300]};
    outline-offset: 2px;
  }
`;

// Modal components
export const ModalOverlay = styled.div`
  align-items: center;
  backdrop-filter: blur(8px);
  background: rgb(0 0 0 / 0.5);
  inset: 0;
  display: flex;
  justify-content: center;
  padding: 2rem;
  position: fixed;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  animation: modalFadeIn 0.3s ease-out;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgb(0 0 0 / 0.25);
  max-width: 500px;
  padding: 3rem 2.5rem;
  position: relative;
  text-align: center;
  width: 100%;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-family: Montserrat, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem;
`;

export const ModalSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 2rem;
`;

export const BenefitsList = styled.ul`
  list-style: none;
  margin: 0 0 2rem;
  padding: 0;
  text-align: left;
`;

export const BenefitItem = styled.li`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  margin: 0.75rem 0;
  padding-left: 0.5rem;
`;

export const AppMessage = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondary[50]} 0%,
    ${({ theme }) => theme.colors.primary[50]} 100%
  );
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  margin: 2rem 0;
  padding: 1.5rem;
  text-align: center;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (width <= 480px) {
    flex-direction: column;
  }
`;
