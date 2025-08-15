'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { ArrowUpDown } from 'lucide-react';

import { useAuth } from '@providers/AuthProvider';
import { useToast } from '@providers/ToastProvider';
import { useTranslation } from '@i18n/index';

import type {
  BusinessAccount,
  BusinessAccountsManagementProps,
  FilterState,
} from './BusinessAccountsManagement.interfaces';

import {
  BusinessDetails,
  BusinessInfo,
  BusinessName,
  Container,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateTitle,
  FilterGroup,
  FilterLabel,
  FiltersContainer,
  GiroTag,
  GiroTags,
  Header,
  LoadingContainer,
  MetricItem,
  MetricLabel,
  MetricsGrid,
  MetricValue,
  SearchInput,
  Select,
  StatCard,
  StatIcon,
  StatLabel,
  StatsContainer,
  StatusBadge,
  StatValue,
  Subtitle,
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title,
} from './BusinessAccountsManagement.styled';

/**
 * Business Accounts Management component for SUPER_ADMIN.
 * Displays all business accounts in the system with filtering and management capabilities.
 */
export const BusinessAccountsManagement: React.FC<BusinessAccountsManagementProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();

  // State
  const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    giro: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: '',
  });

  // Stats
  const stats = useMemo(() => {
    const totalAccounts = businessAccounts.length;
    const activeAccounts = businessAccounts.filter((acc) => acc.status === 'ACTIVE').length;
    const totalVenues = businessAccounts.reduce((sum, acc) => sum + acc.venuesCount, 0);
    const totalRevenue = businessAccounts.reduce((sum, acc) => sum + acc.totalRevenue, 0);

    return {
      activeAccounts,
      totalAccounts,
      totalRevenue,
      totalVenues,
    };
  }, [businessAccounts]);

  // Filtered and sorted business accounts
  const filteredAccounts = useMemo(() => {
    let filtered = businessAccounts.filter((account) => {
      const matchesSearch =
        !filters.search ||
        account.businessName.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.owner.displayName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.email?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || account.status === filters.status;
      const matchesGiro = !filters.giro || account.businessGiros.includes(filters.giro);

      return matchesSearch && matchesStatus && matchesGiro;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof BusinessAccount];
      const bValue = b[filters.sortBy as keyof BusinessAccount];

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [businessAccounts, filters]);

  // Load business accounts data
  const loadBusinessAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      // Simulated data for now
      const mockData: BusinessAccount[] = [
        {
          address: 'Av. Principal 123',
          businessGiros: ['hospitality', 'food'],
          businessName: 'Hotel Boutique Vista Hermosa',
          city: 'México',
          createdAt: new Date('2024-01-15'),
          email: 'admin@vistahermosa.com',
          id: '1',
          owner: {
            displayName: 'Roberto Salazar',
            email: 'roberto@vistahermosa.com',
            firstName: 'Roberto',
            id: '1',
            lastName: 'Salazar',
            role: 'ADMIN',
          } as any,
          phone: '+52-555-1234567',
          reservationsCount: 156,
          servicesCount: 8,
          state: 'CDMX',
          status: 'ACTIVE',
          taxId: 'RFC123456789',
          totalRevenue: 45000,
          venuesCount: 3,
          website: 'https://vistahermosa.com',
        },
        {
          address: 'Calle Gourmet 456',
          businessGiros: ['food', 'events'],
          businessName: 'Restaurante Los Sabores',
          city: 'Guadalajara',
          createdAt: new Date('2024-02-20'),
          email: 'admin@lossabores.com',
          id: '2',
          owner: {
            displayName: 'Patricia Morales',
            email: 'patricia@lossabores.com',
            firstName: 'Patricia',
            id: '2',
            lastName: 'Morales',
            role: 'ADMIN',
          } as any,
          phone: '+52-333-9876543',
          reservationsCount: 89,
          servicesCount: 5,
          state: 'Jalisco',
          status: 'ACTIVE',
          taxId: 'RFC987654321',
          totalRevenue: 28000,
          venuesCount: 2,
          website: 'https://lossabores.com',
        },
        {
          address: 'Plaza Bienestar 789',
          businessGiros: ['wellness', 'services'],
          businessName: 'Spa & Wellness Centro',
          city: 'Monterrey',
          createdAt: new Date('2024-03-10'),
          email: 'admin@spawellness.com',
          id: '3',
          owner: {
            displayName: 'Ana García',
            email: 'ana@spawellness.com',
            firstName: 'Ana',
            id: '3',
            lastName: 'García',
            role: 'ADMIN',
          } as any,
          phone: '+52-811-2468135',
          reservationsCount: 67,
          servicesCount: 12,
          state: 'Nuevo León',
          status: 'PENDING',
          taxId: 'RFC456789123',
          totalRevenue: 18500,
          venuesCount: 1,
        },
      ];

      setBusinessAccounts(mockData);
    } catch (err) {
      console.error('Error loading business accounts:', err);
      setError(t('admin.businessAccounts.errors.loadFailed'));
      showToast({
        description: t('admin.businessAccounts.errors.loadFailed'),
        title: t('common.error'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinessAccounts();
  }, []);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSort = (column: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div>{t('common.loading')}</div>
      </LoadingContainer>
    );
  }

  return (
    <Container className={className}>
      <Header>
        <Title>{t('admin.businessAccounts.title')}</Title>
        <Subtitle>{t('admin.businessAccounts.subtitle')}</Subtitle>
      </Header>

      {/* Stats Cards */}
      <StatsContainer>
        <StatCard>
          <StatIcon>🏢</StatIcon>
          <StatValue>{stats.totalAccounts}</StatValue>
          <StatLabel>{t('admin.businessAccounts.stats.totalAccounts')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>✅</StatIcon>
          <StatValue>{stats.activeAccounts}</StatValue>
          <StatLabel>{t('admin.businessAccounts.stats.activeAccounts')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>🏨</StatIcon>
          <StatValue>{stats.totalVenues}</StatValue>
          <StatLabel>{t('admin.businessAccounts.stats.totalVenues')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>💰</StatIcon>
          <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
          <StatLabel>{t('admin.businessAccounts.stats.totalRevenue')}</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Filters */}
      <FiltersContainer>
        <FilterGroup>
          <FilterLabel>{t('admin.businessAccounts.filters.search')}</FilterLabel>
          <SearchInput
            placeholder={t('admin.businessAccounts.filters.searchPlaceholder')}
            type='text'
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t('admin.businessAccounts.filters.status')}</FilterLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value=''>{t('admin.businessAccounts.filters.allStatuses')}</option>
            <option value='ACTIVE'>{t('admin.businessAccounts.status.active')}</option>
            <option value='INACTIVE'>{t('admin.businessAccounts.status.inactive')}</option>
            <option value='PENDING'>{t('admin.businessAccounts.status.pending')}</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>{t('admin.businessAccounts.filters.giro')}</FilterLabel>
          <Select value={filters.giro} onChange={(e) => handleFilterChange('giro', e.target.value)}>
            <option value=''>{t('admin.businessAccounts.filters.allGiros')}</option>
            <option value='hospitality'>{t('admin.businessAccount.giros.hospitality')}</option>
            <option value='food'>{t('admin.businessAccount.giros.food')}</option>
            <option value='wellness'>{t('admin.businessAccount.giros.wellness')}</option>
            <option value='tourism'>{t('admin.businessAccount.giros.tourism')}</option>
            <option value='events'>{t('admin.businessAccount.giros.events')}</option>
            <option value='entertainment'>{t('admin.businessAccount.giros.entertainment')}</option>
            <option value='retail'>{t('admin.businessAccount.giros.retail')}</option>
            <option value='services'>{t('admin.businessAccount.giros.services')}</option>
          </Select>
        </FilterGroup>
      </FiltersContainer>

      {/* Business Accounts Table */}
      {filteredAccounts.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell onClick={() => handleSort('businessName')}>
                  {t('admin.businessAccounts.table.business')} <ArrowUpDown size={14} />
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('owner.name')}>
                  {t('admin.businessAccounts.table.owner')} <ArrowUpDown size={14} />
                </TableHeaderCell>
                <TableHeaderCell>{t('admin.businessAccounts.table.giros')}</TableHeaderCell>
                <TableHeaderCell>{t('admin.businessAccounts.table.location')}</TableHeaderCell>
                <TableHeaderCell>{t('admin.businessAccounts.table.metrics')}</TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('status')}>
                  {t('admin.businessAccounts.table.status')} <ArrowUpDown size={14} />
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('createdAt')}>
                  {t('admin.businessAccounts.table.joined')} <ArrowUpDown size={14} />
                </TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <BusinessInfo>
                      <BusinessName>{account.businessName}</BusinessName>
                      <BusinessDetails>
                        {account.taxId && `RFC: ${account.taxId}`}
                        {account.email && (
                          <>
                            {account.taxId && ' • '}
                            {account.email}
                          </>
                        )}
                      </BusinessDetails>
                    </BusinessInfo>
                  </TableCell>

                  <TableCell>
                    <BusinessInfo>
                      <BusinessName>{account.owner.displayName}</BusinessName>
                      <BusinessDetails>{account.owner.email}</BusinessDetails>
                    </BusinessInfo>
                  </TableCell>

                  <TableCell>
                    <GiroTags>
                      {account.businessGiros.slice(0, 2).map((giro) => (
                        <GiroTag key={giro}>{t(`admin.businessAccount.giros.${giro}`)}</GiroTag>
                      ))}
                      {account.businessGiros.length > 2 && (
                        <GiroTag>+{account.businessGiros.length - 2}</GiroTag>
                      )}
                    </GiroTags>
                  </TableCell>

                  <TableCell>
                    <BusinessDetails>
                      {account.city && account.state && `${account.city}, ${account.state}`}
                      {account.phone && (
                        <>
                          <br />
                          {account.phone}
                        </>
                      )}
                    </BusinessDetails>
                  </TableCell>

                  <TableCell>
                    <MetricsGrid>
                      <MetricItem>
                        <MetricValue>{account.venuesCount}</MetricValue>
                        <MetricLabel>Venues</MetricLabel>
                      </MetricItem>
                      <MetricItem>
                        <MetricValue>{account.servicesCount}</MetricValue>
                        <MetricLabel>Servicios</MetricLabel>
                      </MetricItem>
                      <MetricItem>
                        <MetricValue>{account.reservationsCount}</MetricValue>
                        <MetricLabel>Reservas</MetricLabel>
                      </MetricItem>
                    </MetricsGrid>
                  </TableCell>

                  <TableCell>
                    <StatusBadge $status={account.status}>
                      {t(`admin.businessAccounts.status.${account.status.toLowerCase()}`)}
                    </StatusBadge>
                  </TableCell>

                  <TableCell>
                    {account.createdAt.toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState>
          <EmptyStateIcon>🏢</EmptyStateIcon>
          <EmptyStateTitle>{t('admin.businessAccounts.empty.title')}</EmptyStateTitle>
          <EmptyStateText>{t('admin.businessAccounts.empty.description')}</EmptyStateText>
        </EmptyState>
      )}
    </Container>
  );
};
