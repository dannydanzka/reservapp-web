import { styled } from 'styled-components';

import { Button } from '@ui/Button';

import { FilterButtonProps, ServiceImageProps } from './ServicesPage.interfaces';

export const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

export const PageHeader = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  color: white;
  margin-bottom: 3rem;
  padding: 4rem 2rem;
  text-align: center;
`;

export const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;

  @media (width <= 768px) {
    font-size: 2rem;
  }
`;

export const PageSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 0 auto;
  max-width: 600px;
  opacity: 0.9;
`;

export const ServicesContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 2rem;
`;

export const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
`;

export const FilterButton = styled.button<FilterButtonProps>`
  background: ${({ $active, theme }) => ($active ? theme.colors.primary[500] : 'white')};
  border: 2px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: 25px;
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.primary[700])};
  cursor: pointer;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  }
`;

export const ServicesGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`;

export const ServiceCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.08);
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.15);
    transform: translateY(-4px);
  }
`;

export const ServiceImage = styled.div<ServiceImageProps>`
  align-items: center;
  background: ${({ $category, theme }) => {
    switch ($category) {
      case 'ACCOMMODATION':
        return `linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.primary[600]} 100%)`;
      case 'RESTAURANT':
        return `linear-gradient(135deg, ${theme.colors.secondary[400]} 0%, ${theme.colors.secondary[600]} 100%)`;
      case 'SPA':
        return `linear-gradient(135deg, #E91E63 0%, #AD1457 100%)`;
      case 'TOUR_OPERATOR':
        return `linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)`;
      case 'EVENT_CENTER':
        return `linear-gradient(135deg, #FF9800 0%, #E65100 100%)`;
      default:
        return `linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.secondary[400]} 100%)`;
    }
  }};
  color: white;
  display: flex;
  height: 200px;
  justify-content: center;
`;

export const ServiceContent = styled.div`
  padding: 1.5rem;
`;

export const ServiceName = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.5;
  margin-bottom: 1rem;
`;

export const ServiceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

export const ServiceDetail = styled.div`
  align-items: center;
  display: flex;
  font-size: 0.9rem;
  justify-content: space-between;
`;

export const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 500;
`;

export const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-weight: 600;
`;

export const LocationInfo = styled.div`
  background: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
`;

export const LocationTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const LocationAddress = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.85rem;
  line-height: 1.4;
`;

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 400px;
`;

export const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
`;

export const EmptyStateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.primary[500]};
`;

export const ErrorContainer = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  border-radius: 16px;
  margin: 2rem 0;
  padding: 4rem 2rem;
  text-align: center;
`;

export const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-bottom: 2rem;
`;

export const RetryButton = styled(Button)`
  margin-top: 1rem;
`;

export const UpgradePrompt = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[100]} 0%,
    ${({ theme }) => theme.colors.secondary[100]} 100%
  );
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 16px;
  margin-bottom: 2rem;
  padding: 2rem;
  text-align: center;
`;

export const UpgradeTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const UpgradeText = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const UpgradeReasons = styled.ul`
  list-style: none;
  margin: 1rem 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  padding: 0;
  text-align: left;
`;

export const UpgradeReason = styled.li`
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;

  &::before {
    color: ${({ theme }) => theme.colors.secondary[600]};
    content: '✓';
    font-weight: bold;
    left: 0;
    position: absolute;
  }
`;
