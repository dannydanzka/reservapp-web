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
import { useRouter } from 'next/navigation';

import { Button } from '@ui/Button';
import { httpPublicApiService, type PublicVenue } from '@services/core/api';
import { LoadingSpinner } from '@ui/LoadingSpinner';
import { useTranslation } from '@i18n/index';
import { useUser } from '@providers/UserContext';

import { Category, ServicesPageProps } from './ServicesPage.interfaces';

import {
  DetailLabel,
  DetailValue,
  EmptyState,
  EmptyStateText,
  EmptyStateTitle,
  ErrorContainer,
  ErrorText,
  ErrorTitle,
  FilterButton,
  FilterSection,
  LoadingContainer,
  LocationAddress,
  LocationInfo,
  LocationTitle,
  PageContainer,
  PageHeader,
  PageSubtitle,
  PageTitle,
  RetryButton,
  ServiceCard,
  ServiceContent,
  ServiceDescription,
  ServiceDetail,
  ServiceDetails,
  ServiceImage,
  ServiceName,
  ServicesContainer,
  ServicesGrid,
  UpgradePrompt,
  UpgradeReason,
  UpgradeReasons,
  UpgradeText,
  UpgradeTitle,
} from './ServicesPage.styled';

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

const getCategoriesWithTranslation = (t: (key: string) => string): Category[] => [
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

export const ServicesPage: React.FC<ServicesPageProps> = () => {
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

      // Load real venues from API
      const venues = await httpPublicApiService.getPublicVenues();
      setVenues(venues ?? []);
    } catch (_loadError) {
      console.error('Error loading venues:', _loadError);
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
