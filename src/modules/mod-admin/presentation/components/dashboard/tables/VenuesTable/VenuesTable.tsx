'use client';

import React from 'react';

import { Calendar, MapPin } from 'lucide-react';

import { useTranslation } from '@i18n/index';

import { VenuesTableProps } from './VenuesTable.interfaces';

import {
  CategoryBadge,
  EmptyStateContainer,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  LoadingContainer,
  LoadingText,
  ReservationsCount,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSubtitle,
  TableTitle,
  TableWrapper,
  VenueName,
} from './VenuesTable.styled';

/**
 * Venues table component for displaying popular venues in a clean table format
 */
export const VenuesTable: React.FC<VenuesTableProps> = ({ data, loading = false, maxRows = 5 }) => {
  const { t } = useTranslation();

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      ACCOMMODATION: t('admin.venues.categories.accommodation'),
      ENTERTAINMENT: t('admin.venues.categories.entertainment'),
      EVENT_CENTER: t('admin.venues.categories.eventCenter'),
      RESTAURANT: t('admin.venues.categories.restaurant'),
      SPA: t('admin.venues.categories.spa'),
      TOUR_OPERATOR: t('admin.venues.categories.tourOperator'),
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <TableContainer>
        <TableHeader>
          <TableTitle>{t('admin.dashboard.tables.popularVenues.title')}</TableTitle>
          <TableSubtitle>{t('admin.dashboard.tables.popularVenues.subtitle')}</TableSubtitle>
        </TableHeader>
        <LoadingContainer>
          <LoadingText>{t('common.loading')}</LoadingText>
        </LoadingContainer>
      </TableContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <TableContainer>
        <TableHeader>
          <TableTitle>{t('admin.dashboard.tables.popularVenues.title')}</TableTitle>
          <TableSubtitle>{t('admin.dashboard.tables.popularVenues.subtitle')}</TableSubtitle>
        </TableHeader>
        <EmptyStateContainer>
          <EmptyStateIcon>
            <MapPin size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>
            {t('admin.dashboard.tables.popularVenues.noData.title')}
          </EmptyStateTitle>
          <EmptyStateDescription>
            {t('admin.dashboard.tables.popularVenues.noData.description')}
          </EmptyStateDescription>
        </EmptyStateContainer>
      </TableContainer>
    );
  }

  const displayData = maxRows ? data.slice(0, maxRows) : data;

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>{t('admin.dashboard.tables.popularVenues.title')}</TableTitle>
        <TableSubtitle>{t('admin.dashboard.tables.popularVenues.subtitle')}</TableSubtitle>
      </TableHeader>

      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>
                {t('admin.dashboard.tables.popularVenues.columns.name')}
              </TableHeaderCell>
              <TableHeaderCell>
                {t('admin.dashboard.tables.popularVenues.columns.category')}
              </TableHeaderCell>
              <TableHeaderCell>
                {t('admin.dashboard.tables.popularVenues.columns.reservations')}
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell>
                  <VenueName>{venue.name}</VenueName>
                </TableCell>
                <TableCell>
                  <CategoryBadge>{getCategoryLabel(venue.category)}</CategoryBadge>
                </TableCell>
                <TableCell>
                  <ReservationsCount>
                    <Calendar size={14} />
                    {venue.reservationsCount}
                  </ReservationsCount>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </TableContainer>
  );
};
