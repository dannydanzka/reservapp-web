import { styled } from 'styled-components';

import { PricingCardProps } from './BusinessPage.interfaces';

export const PageContainer = styled.div`
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  align-items: center;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[600]} 0%,
    ${({ theme }) => theme.colors.secondary[600]} 100%
  );
  color: white;
  display: flex;
  flex-direction: column;
  padding: 6rem 2rem;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  max-width: 800px;

  @media (width <= 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 700px;
  opacity: 0.9;

  @media (width <= 768px) {
    font-size: 1.25rem;
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;

export const BenefitsSection = styled.section`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  padding: 6rem 2rem;
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

export const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 1.25rem;
  margin-bottom: 4rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  text-align: center;
`;

export const BenefitsGrid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 0 auto;
  max-width: 1200px;
`;

export const BenefitCard = styled.div`
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

export const BenefitIcon = styled.div`
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

export const BenefitTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const BenefitDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.6;
`;

export const PricingSection = styled.section`
  background-color: white;
  padding: 6rem 2rem;
`;

export const PricingGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin: 0 auto;
  max-width: 1200px;

  @media (width >= 1366px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1000px;
  }

  @media (width >= 1440px) {
    gap: 2.5rem;
    max-width: 1200px;
  }

  @media (width <= 1024px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

export const PricingCard = styled.div<PricingCardProps>`
  background: white;
  border: ${({ $featured, theme }) =>
    $featured ? `3px solid ${theme.colors.secondary[500]}` : '2px solid #e2e8f0'};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  padding: 3rem 2rem;
  position: relative;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  @media (width <= 1024px) {
    min-height: auto;
  }

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
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const PlanPrice = styled.div`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

export const PlanPeriod = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 2rem;
`;

export const PlanFeatures = styled.ul`
  flex: 1;
  list-style: none;
  margin: 2rem 0;
  padding: 0;
`;

export const PlanFeature = styled.li`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary[700]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: 0.5rem 0;

  &::before {
    align-items: center;
    color: ${({ theme }) => theme.colors.secondary[500]};
    content: '✓';
    display: flex;
    flex-shrink: 0;
    font-weight: bold;
    height: 16px;
    justify-content: center;
    margin-right: 0;
    width: 16px;
  }
`;

export const ContactFormSection = styled.section`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  padding: 6rem 2rem;
`;
