'use client';

import React, { useCallback, useEffect, useState } from 'react';

import {
  Briefcase,
  Calendar,
  Hotel,
  MapPin,
  PartyPopper,
  Phone,
  Sparkles,
  Star,
  Store,
  Target,
  UtensilsCrossed,
} from 'lucide-react';
import { styled } from 'styled-components';
import { useRouter } from 'next/navigation';

import { Button } from '@/libs/ui/components/Button';
import { LoadingSpinner } from '@/libs/ui/components/LoadingSpinner';
import { publicApiService, PublicVenue } from '@/libs/services/api/publicApiService';
import { useTranslation } from '@/libs/i18n';
import { useUser } from '@/libs/ui/providers';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[500]} 0%,
    ${({ theme }) => theme.colors.secondary[500]} 100%
  );
  color: white;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
`;

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  justify-content: center;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${({ theme }) => theme.colors.primary[300]};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary[500] : 'white')};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.primary[700])};
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ServiceImage = styled.div<{ $category: string }>`
  height: 200px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ServiceContent = styled.div`
  padding: 1.5rem;
`;

const ServiceName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ServiceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const ServiceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-weight: 600;
`;

const LocationInfo = styled.div`
  background: ${({ theme }) => theme.colors.secondary[50]};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const LocationTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: 0.5rem;
`;

const LocationAddress = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.4;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.error[50]};
  border-radius: 16px;
  margin: 2rem 0;
`;

const ErrorTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.error[600]};
  margin-bottom: 1rem;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-bottom: 2rem;
`;

const RetryButton = styled(Button)`
  margin-top: 1rem;
`;

const UpgradePrompt = styled.div`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[100]} 0%,
    ${({ theme }) => theme.colors.secondary[100]} 100%
  );
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const UpgradeTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[800]};
  margin-bottom: 1rem;
`;

const UpgradeText = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const UpgradeReasons = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const UpgradeReason = styled.li`
  color: ${({ theme }) => theme.colors.primary[700]};
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.5rem;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${({ theme }) => theme.colors.secondary[600]};
    font-weight: bold;
  }
`;

// Function to get category icons using Lucide React
const getCategoryIcon = (category: string, size: number = 48): React.ReactNode => {
  const iconProps = { size, strokeWidth: 1.5 };

  switch (category) {
    case 'ACCOMMODATION':
      return <Hotel {...iconProps} />;
    case 'RESTAURANT':
      return <UtensilsCrossed {...iconProps} />;
    case 'SPA':
      return <Sparkles {...iconProps} />;
    case 'TOUR_OPERATOR':
      return <Briefcase {...iconProps} />;
    case 'EVENT_CENTER':
      return <PartyPopper {...iconProps} />;
    case 'ENTERTAINMENT':
      return <Calendar {...iconProps} />;
    case 'all':
      return <Target {...iconProps} />;
    default:
      return <Store {...iconProps} />;
  }
};

const getCategoriesWithTranslation = (t: (key: string) => string) => [
  { icon: getCategoryIcon('all', 16), key: 'all', label: t('services.filters.allServices') },
  {
    icon: getCategoryIcon('ACCOMMODATION', 16),
    key: 'ACCOMMODATION',
    label: t('services.filters.accommodation'),
  },
  {
    icon: getCategoryIcon('RESTAURANT', 16),
    key: 'RESTAURANT',
    label: t('services.filters.restaurant'),
  },
  { icon: getCategoryIcon('SPA', 16), key: 'SPA', label: t('services.filters.spa') },
  {
    icon: getCategoryIcon('TOUR_OPERATOR', 16),
    key: 'TOUR_OPERATOR',
    label: t('services.filters.tours'),
  },
  {
    icon: getCategoryIcon('EVENT_CENTER', 16),
    key: 'EVENT_CENTER',
    label: t('services.filters.events'),
  },
  {
    icon: getCategoryIcon('ENTERTAINMENT', 16),
    key: 'ENTERTAINMENT',
    label: t('services.filters.entertainment'),
  },
];

const getCategoryLabel = (category: string, t: (key: string) => string): string => {
  const categoryKey = `services.categories.${category}`;
  return t(categoryKey) || t('services.categories.ACCOMMODATION');
};

export const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const [venues, setVenues] = useState<PublicVenue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<PublicVenue[]>([]);
  const { canMakeReservations, getUpgradeReasons, shouldShowUpgradePrompt } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const categories = getCategoriesWithTranslation(t);

  const loadVenues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Load venues from public API (no authentication required)
      const response = await publicApiService.getPublicVenues();
      setVenues(response.data ?? []);
    } catch (_loadError) {
      // Log error for development - in production this should be handled by error reporting service
      setError(t('services.error.failedToLoad'));
      setVenues([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredVenues(venues);
    } else {
      setFilteredVenues(venues.filter((venue) => venue.category === selectedCategory));
    }
  }, [venues, selectedCategory]);

  const handleViewService = (venueId: string) => {
    if (canMakeReservations) {
      // Premium users can view detailed service page
      router.push(`/services/${venueId}`);
    } else {
      // Free users are prompted to register/upgrade
      router.push(`/auth/register?redirect=/services/${venueId}&upgrade=true`);
    }
  };

  const handleDownloadApp = () => {
    // For now, redirect to register - later this could be app store links
    router.push('/auth/register?source=landing-cta');
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>{t('services.title')}</PageTitle>
          <PageSubtitle>{t('services.subtitle')}</PageSubtitle>
        </PageHeader>
        <LoadingContainer>
          <LoadingSpinner size='large' />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('services.title')}</PageTitle>
        <PageSubtitle>{t('services.subtitle')}</PageSubtitle>
      </PageHeader>

      <ServicesContainer>
        <FilterSection>
          {categories.map((category) => (
            <FilterButton
              $active={selectedCategory === category.key}
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.icon} {category.label}
            </FilterButton>
          ))}
        </FilterSection>

        {/* Upgrade prompt for free users */}
        {shouldShowUpgradePrompt() && (
          <UpgradePrompt>
            <UpgradeTitle>¿Te gusta lo que ves?</UpgradeTitle>
            <UpgradeText>
              Estás viendo nuestra selección de servicios de alta calidad en Guadalajara. para
              acceder a todas las funcionalidades.
            </UpgradeText>
            <UpgradeReasons>
              {getUpgradeReasons().map((reason, index) => (
                <UpgradeReason key={index}>{reason}</UpgradeReason>
              ))}
            </UpgradeReasons>
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}
            >
              <Button
                size='large'
                variant='contained'
                onClick={() => router.push('/auth/register?source=services-upgrade')}
              >
                Registrarse Gratis
              </Button>
              <Button size='large' variant='outlined' onClick={handleDownloadApp}>
                Descargar App
              </Button>
            </div>
          </UpgradePrompt>
        )}

        {error && (
          <ErrorContainer>
            <ErrorTitle>{t('services.error.loadTitle')}</ErrorTitle>
            <ErrorText>{error}</ErrorText>
            <RetryButton variant='contained' onClick={() => loadVenues()}>
              {t('services.error.tryAgain')}
            </RetryButton>
          </ErrorContainer>
        )}

        {!error && filteredVenues.length === 0 && (
          <EmptyState>
            <EmptyStateTitle>{t('services.emptyState.title')}</EmptyStateTitle>
            <EmptyStateText>{t('services.emptyState.description')}</EmptyStateText>
          </EmptyState>
        )}

        {!error && filteredVenues.length > 0 && (
          <ServicesGrid>
            {filteredVenues.map((venue) => (
              <ServiceCard key={venue.id}>
                <ServiceImage $category={venue.category}>
                  {getCategoryIcon(venue.category, 48)}
                </ServiceImage>
                <ServiceContent>
                  <ServiceName>{venue.name}</ServiceName>
                  <ServiceDescription>
                    {venue.description ?? 'Servicio de alta calidad disponible para reservación.'}
                  </ServiceDescription>

                  <LocationInfo>
                    <LocationTitle>
                      <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                      {t('services.details.location')}
                    </LocationTitle>
                    <LocationAddress>
                      {venue.address}
                      {venue.city && `, ${venue.city}`}
                    </LocationAddress>
                  </LocationInfo>

                  <ServiceDetails>
                    <ServiceDetail>
                      <DetailLabel>{t('services.details.category')}:</DetailLabel>
                      <DetailValue>{getCategoryLabel(venue.category, t)}</DetailValue>
                    </ServiceDetail>
                    <ServiceDetail>
                      <DetailLabel>
                        {venue._count.services} {t('services.details.servicesAvailable')}
                      </DetailLabel>
                      <DetailValue />
                    </ServiceDetail>
                    {venue.rating && (
                      <ServiceDetail>
                        <DetailLabel>{t('services.details.rating')}:</DetailLabel>
                        <DetailValue>
                          <Star size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                          {venue.rating.toFixed(1)}
                        </DetailValue>
                      </ServiceDetail>
                    )}
                    {venue.phone && (
                      <ServiceDetail>
                        <DetailLabel>{t('services.details.phone')}:</DetailLabel>
                        <DetailValue>
                          <Phone size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                          {venue.phone}
                        </DetailValue>
                      </ServiceDetail>
                    )}
                  </ServiceDetails>

                  {/* Different CTAs based on user subscription status */}
                  {canMakeReservations ? (
                    <Button
                      size='medium'
                      style={{ width: '100%' }}
                      variant='contained'
                      onClick={() => handleViewService(venue.id)}
                    >
                      {t('services.details.viewDetails')}
                    </Button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Button
                        size='medium'
                        style={{ width: '100%' }}
                        variant='outlined'
                        onClick={() => handleViewService(venue.id)}
                      >
                        Ver Detalles (Registrarse)
                      </Button>
                      <Button
                        size='small'
                        style={{ width: '100%' }}
                        variant='contained'
                        onClick={handleDownloadApp}
                      >
                        Descargar App
                      </Button>
                    </div>
                  )}
                </ServiceContent>
              </ServiceCard>
            ))}
          </ServicesGrid>
        )}
      </ServicesContainer>
    </PageContainer>
  );
};
