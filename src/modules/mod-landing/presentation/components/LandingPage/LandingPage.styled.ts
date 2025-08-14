import { styled } from 'styled-components';

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

export const HeroGrid = styled.div`
  align-items: center;
  display: grid;
  gap: 4rem;
  grid-template-columns: 1fr 400px;
  margin: 0 auto;
  max-width: 1200px;

  @media (width <= 1024px) {
    gap: 3rem;
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (width <= 768px) {
    align-items: center;
    flex-direction: column;
  }
`;

export const MobileAppShowcase = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const AppDownloadSection = styled.div`
  backdrop-filter: blur(10px);
  background-color: rgb(255 255 255 / 0.8);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 2rem;
  text-align: center;
`;

export const AppDownloadTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: '"Montserrat"', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
`;

export const AppDownloadText = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: '"Lato"', sans-serif;
  font-size: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const AppStoreButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

export const AppStoreButton = styled.div`
  align-items: center;
  background-color: rgb(0 0 0 / 0.6);
  border: 1px dashed rgb(255 255 255 / 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: white;
  cursor: default;
  display: flex;
  font-size: 0.9rem;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  transition: all 0.15s ease;

  &:hover {
    background-color: rgb(0 0 0 / 0.7);
  }
`;

export const FeaturesSection = styled.section`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  padding: 6rem 2rem;
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

export const ServicesSection = styled.section`
  background-color: white;
  padding: 6rem 2rem;
`;

export const ServicesGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin: 0 auto;
  max-width: 1200px;
`;

export const ServiceCard = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition:
    border-color 0.3s ease,
    transform 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    transform: translateY(-4px);
  }
`;

export const ServiceIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const ServiceTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const PricingSection = styled.section`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  padding: 6rem 2rem;
`;

export const PricingSection2 = styled.section`
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

export const CTASection = styled.section`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[600]} 0%,
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  color: white;
  padding: 6rem 2rem;
  text-align: center;
`;

export const CTATitle = styled.h2`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const CTASubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  opacity: 0.9;
`;

export const ScreenshotImage = styled.img`
  border-radius: 20px;
  box-shadow: 0 20px 60px rgb(0 0 0 / 0.15);
  height: auto;
  max-height: 500px;
  max-width: 100%;
  object-fit: contain;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 30px 80px rgb(0 0 0 / 0.2);
    transform: translateY(-10px) scale(1.02);
  }
`;

export const MobileScreenshotWrapper = styled.div`
  max-width: 400px;
  position: relative;
  width: 100%;

  @media (width <= 768px) {
    max-width: 250px;
  }
`;

export const AppStoreText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
`;
