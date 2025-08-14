import { styled } from 'styled-components';
import Link from 'next/link';

import { SubmitButtonProps } from './LoginPage.interfaces';

export const LoginContainer = styled.div`
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[900]};
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;
  position: relative;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;
  max-width: 800px;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.1);

  @media (width <= 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: '"Lato"', sans-serif;
  font-size: 1.25rem;
  line-height: 1.6;
  max-width: 600px;

  @media (width <= 768px) {
    font-size: 1.1rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.secondary[600]};
    font-weight: 700;
  }
`;

// Sección del formulario similar a otras secciones de Landing
export const FormSection = styled.section`
  align-items: center;
  background-color: white;
  display: flex;
  justify-content: center;
  min-height: 55vh;
  padding: 2rem;
`;

export const FormContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgb(0 0 0 / 0.12);
  max-width: 500px;
  padding: 3rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  width: 100%;

  &:hover {
    box-shadow: 0 12px 50px rgb(0 0 0 / 0.15);
    transform: translateY(-4px);
  }
`;

export const FormTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const FormSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: '"Lato"', sans-serif;
  font-size: 1rem;
  margin-bottom: 2rem;
  text-align: center;
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
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const Input = styled.input`
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: '"Lato"', sans-serif;
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  transition: all 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.primary[400]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.primary[50]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SubmitButton = styled.button<SubmitButtonProps>`
  align-items: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[600]} 0%,
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  cursor: ${({ $isLoading }) => ($isLoading ? 'not-allowed' : 'pointer')};
  display: flex;
  font-family: '"Montserrat"', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  transition: all 0.15s ease;
  width: 100%;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgb(0 0 0 / 0.15);
    transform: translateY(-2px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error[50]};
  border: 2px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.error[700]};
  font-family: '"Lato"', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: center;
`;

// Secciones adicionales usando el mismo estilo que LandingPage
export const DemoSection = styled.section`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  padding: 2rem;
`;

export const DemoContainer = styled.div`
  margin: 0 auto;
  max-width: 600px;
  text-align: center;
`;

export const DemoTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

export const DemoGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: 2rem;
`;

export const DemoCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
  transition:
    border-color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.secondary[400]};
    transform: translateY(-2px);
  }
`;

export const DemoLabel = styled.div`
  color: ${({ theme }) => theme.colors.secondary[800]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const DemoCredential = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-family: '"Lato"', sans-serif;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

export const DemoButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary[600]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: white;
  cursor: pointer;
  font-family: '"Montserrat"', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: all 0.15s ease;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[700]};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Sección de información usando estilo de LandingPage
export const InfoSection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[600]} 0%,
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  color: white;
  padding: 4rem 2rem;
  text-align: center;
`;

export const InfoContainer = styled.div`
  margin: 0 auto;
  max-width: 600px;
`;

export const InfoTitle = styled.h3`
  align-items: center;
  color: white;
  display: flex;
  font-family: '"Montserrat"', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const InfoText = styled.p`
  color: rgb(255 255 255 / 0.9);
  font-family: '"Lato"', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0;
`;

// Sección de links usando estilo consistente
export const LinksSection = styled.section`
  background-color: white;
  padding: 3rem 2rem;
`;

export const LinksContainer = styled.div`
  margin: 0 auto;
  max-width: 500px;
  text-align: center;
`;

export const LinksText = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: '"Lato"', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const LinksGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (width >= 480px) {
    flex-direction: row;
    justify-content: center;
  }
`;

export const AuthLink = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary[100]};
  border: 2px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[200]};
    border-color: ${({ theme }) => theme.colors.primary[400]};
    color: ${({ theme }) => theme.colors.primary[800]};
    transform: translateY(-2px);
  }
`;
