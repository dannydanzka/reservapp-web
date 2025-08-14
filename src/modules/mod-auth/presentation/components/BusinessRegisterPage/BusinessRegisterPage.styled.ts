import { styled } from 'styled-components';

import { ButtonProps, PackageCardProps, StepProps } from './BusinessRegisterPage.interfaces';

// Reutilizamos los componentes principales de UserRegisterPage
export {
  FormSection,
  FormContainer,
  Form,
  FormRow,
  FormGroup,
  FormTitle,
  FormSubtitle,
  Input,
  Label,
  ErrorMessage,
  LinkContainer,
  LinkText,
  StyledLink,
} from '@mod-auth/presentation/components/UserRegisterPage/UserRegisterPage.styled';

// Layout container
export const LandingContainer = styled.div`
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[900]};
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem;
  position: relative;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  max-width: 800px;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.1);

  @media (width <= 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: '"Lato"', sans-serif;
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 700px;

  @media (width <= 768px) {
    font-size: 1.25rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.secondary[600]};
    font-weight: 700;
  }
`;

// Value proposition container similar to UserRegisterPage
export const ValuePropContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1200px;
  text-align: center;

  @media (width <= 968px) {
    gap: 2rem;
  }
`;

// New Info Section for stats and dashboard mockup
export const InfoSection = styled.section`
  background: ${({ theme }) => theme.colors.primary[25]};
  padding: 4rem 2rem;
`;

export const InfoShowcaseContainer = styled.div`
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

  h2 {
    color: ${({ theme }) => theme.colors.primary[800]};
    font-family: Montserrat, sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    color: ${({ theme }) => theme.colors.primary[600]};
    font-family: Lato, sans-serif;
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 2rem;

  @media (width <= 768px) {
    gap: 0.5rem;
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: rgb(255 255 255 / 0.9);
  border: 2px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
`;

export const InfoNumber = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-family: Montserrat, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

export const InfoText = styled.div`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.3;
`;

export const AdminDashboardShowcase = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const AdminDashboardImage = styled.img`
  border: 3px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 16px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 0.15);
  height: auto;
  max-width: 600px;
  transition: transform 0.3s ease;
  width: 100%;

  @media (width <= 768px) {
    border-radius: 12px;
    border-width: 2px;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

// Checkbox components - Same styling as before but cleaner
export const CheckboxGrid = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[25]};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 12px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 16px;
  padding: 16px;

  @media (width <= 768px) {
    gap: 10px;
    grid-template-columns: 1fr;
    padding: 12px;
  }
`;

export const CheckboxLabel = styled.label`
  align-items: center;
  background-color: white;
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.primary[700]};
  cursor: pointer;
  display: flex;
  font-size: 15px;
  font-weight: 500;
  gap: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[25]};
    border-color: ${({ theme }) => theme.colors.secondary[400]};
    color: ${({ theme }) => theme.colors.primary[900]};
    transform: translateY(-1px);
  }

  &:has(input:checked) {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
    border-color: ${({ theme }) => theme.colors.secondary[400]};
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export const CheckboxInput = styled.input`
  accent-color: ${({ theme }) => theme.colors.secondary[600]};
  cursor: pointer;
  height: 18px;
  margin: 0;
  width: 18px;
`;

export const GiroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 14px;
  line-height: 1.4;
  margin: 8px 0 16px;
`;

// Highlighted text span for the "GRATIS" part
export const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.success[500]};
  font-weight: 700;
`;

// ButtonGroup component
export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};

  button {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: center;
    width: 100%;
  }
`;

/* Legacy components that are no longer used but keeping for backwards compatibility */

export const FeaturesSection = styled.section`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  padding: 3rem 2rem;
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

export const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: '"Lato"', sans-serif;
  font-size: 1.25rem;
  margin-bottom: 4rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  text-align: center;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 0 auto;
  max-width: 1200px;
`;

export const FeatureCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.08);
  padding: 3rem 2rem;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 40px rgb(0 0 0 / 0.12);
    transform: translateY(-8px);
  }
`;

export const FeatureIcon = styled.div`
  align-items: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  border-radius: 50%;
  color: white;
  display: flex;
  font-size: 2rem;
  height: 80px;
  justify-content: center;
  margin: 0 auto 2rem;
  width: 80px;
`;

export const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.6;
`;

// Styled component for select dropdown
export const StyledSelect = styled.select`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-family: Lato, sans-serif;
  font-size: 16px;
  padding: 12px;
  transition: border-color 0.2s ease;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

export const HeroGrid = styled.div`
  align-items: center;
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  margin: 0 auto;
  max-width: 1200px;
  text-align: center;

  @media (width <= 1024px) {
    gap: 2rem;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PricingSection = styled.section`
  background-color: white;
  padding: 6rem 2rem;
`;

export const PricingGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin: 0 auto;
  max-width: 900px;
`;

export const PricingCard = styled.div<{ $featured?: boolean }>`
  background: white;
  border: ${({ $featured, theme }) =>
    $featured ? `3px solid ${theme.colors.secondary[500]}` : '2px solid #e2e8f0'};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.08);
  padding: 3rem 2rem;
  position: relative;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.15);
    transform: translateY(-4px);
  }
`;

export const PopularBadge = styled.div`
  background: ${({ theme }) => theme.colors.secondary[500]};
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  left: 50%;
  padding: 0.5rem 1rem;
  position: absolute;
  top: -12px;
  transform: translateX(-50%);
`;

export const PlanName = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const PlanPrice = styled.div`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

export const PlanPeriod = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 2rem;
`;

export const PlanFeatures = styled.ul`
  list-style: none;
  margin: 2rem 0;
  padding: 0;
`;

export const PlanFeature = styled.li`
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: 0.5rem 0;

  &::before {
    color: ${({ theme }) => theme.colors.secondary[500]};
    content: '✓';
    font-weight: bold;
    margin-right: 0.5rem;
  }
`;

export const BusinessInfoCard = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  border-radius: 16px;
  color: white;
  margin-bottom: 3rem;
  padding: 2.5rem;
  text-align: center;

  ul {
    margin-top: 1rem;
    text-align: left;
  }
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

  ${({ $variant = 'primary', size = 'medium', theme }) => {
    const sizeStyles = {
      large: `
        padding: ${theme.spacing[4]} ${theme.spacing[6]};
        font-size: 1.125rem;
      `,
      medium: `
        padding: ${theme.spacing[3]} ${theme.spacing[4]};
        font-size: 1rem;
      `,
      small: `
        padding: ${theme.spacing[2]} ${theme.spacing[3]};
        font-size: 0.875rem;
      `,
    };

    const variantStyles = {
      contained: `
        background-color: ${theme.colors.primary[600]};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
        }
      `,
      outlined: `
        background-color: transparent;
        border: 2px solid ${theme.colors.primary[600]};
        color: ${theme.colors.primary[600]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[50]};
        }
      `,
      primary: `
        background-color: ${theme.colors.primary[600]};
        color: ${theme.colors.white};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
        }
      `,
      secondary: `
        background-color: ${theme.colors.secondary[200]};
        color: ${theme.colors.secondary[700]};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary[300]};
        }
      `,
    };

    return `
      ${sizeStyles[size]}
      ${variantStyles[$variant] || variantStyles.primary}
    `;
  }}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const PasswordRequirements = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.75rem;
  margin-top: ${({ theme }) => theme.spacing[1]};
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

export const PricingAmount = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;
