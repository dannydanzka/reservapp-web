import { styled } from 'styled-components';

import { PricingCardProps } from './BusinessPage.interfaces';

export const PageContainer = styled.div`
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

export const HeroButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
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
  background: ${({ theme }) => theme.colors.primary[100]};
  border: 2px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primary[700]};
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
  text-align: left;

  &::before {
    align-items: center;
    color: ${({ theme }) => theme.colors.secondary[500]};
    display: flex;
    flex-shrink: 0;
    font-weight: bold;
    height: 16px;
    justify-content: center;
    margin-right: 0;
    width: 16px;
  }
`;

export const ComparisonSection = styled.section`
  background-color: ${({ theme }) => theme.colors.secondary[50]};
  padding: 6rem 2rem;
`;

export const ComparisonContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

export const ComparisonTable = styled.table`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.08);
  margin-top: 3rem;
  overflow: hidden;
  width: 100%;
`;

export const ComparisonTableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.primary[600]};
  color: white;
`;

export const ComparisonTableHeader = styled.th`
  font-weight: 600;
  padding: 1rem;
  text-align: center;

  &:first-child {
    text-align: left;
  }
`;

export const ComparisonTableRow = styled.tr<{ $highlighted?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  ${({ $highlighted, theme }) => $highlighted && `background-color: ${theme.colors.secondary[50]};`}
`;

export const ComparisonTableCell = styled.td<{
  $positive?: boolean;
  $negative?: boolean;
  $neutral?: boolean;
}>`
  padding: 1rem;
  text-align: center;
  font-weight: 500;

  &:first-child {
    text-align: left;
  }

  ${({ $positive, theme }) =>
    $positive &&
    `
    color: ${theme.colors.success[600]};
    font-weight: 700;
  `}

  ${({ $negative, theme }) =>
    $negative &&
    `
    color: ${theme.colors.error[600]};
  `}

  ${({ $neutral, theme }) =>
    $neutral &&
    `
    color: ${theme.colors.warning[600]};
  `}
`;

export const ExampleContainer = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

export const ExampleTitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 2rem;
`;

export const ExampleGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin: 0 auto;
  max-width: 800px;
`;

export const ExampleCard = styled.div<{ $positive?: boolean }>`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.1);
  padding: 1.5rem;

  h4 {
    color: ${({ $positive, theme }) =>
      $positive ? theme.colors.success[600] : theme.colors.error[600]};
    margin-bottom: 0.5rem;
  }

  .amount {
    color: ${({ $positive, theme }) =>
      $positive ? theme.colors.success[600] : theme.colors.error[600]};
    font-size: 1.5rem;
    font-weight: bold;
  }

  .description {
    color: ${({ theme }) => theme.colors.secondary[500]};
    font-size: 0.875rem;
  }
`;
