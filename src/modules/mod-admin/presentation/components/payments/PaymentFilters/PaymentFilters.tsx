'use client';

import { useState } from 'react';

import { Building, Calendar, ChevronDown, DollarSign, Filter, Search, X } from 'lucide-react';

import { Button } from '@ui/Button';
import { Card } from '@ui/Card';
import { PaymentStatus } from '@shared/types/admin.types';
import { useTranslation } from '@i18n/index';

import {
  AdminPaymentFilters,
  AdminVenueOption,
  PAYMENT_STATUSES,
  STATUS_LABELS,
} from './PaymentFilters.interfaces';
import type { PaymentFiltersProps } from './PaymentFilters.interfaces';

import * as S from './PaymentFilters.styled';

export const PaymentFilters = ({ filters, onFiltersChange, venues }: PaymentFiltersProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<AdminPaymentFilters>(filters);

  // Apply filters
  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters: AdminPaymentFilters = {
      limit: 20,
      page: 1,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Update local filter
  const updateFilter = <K extends keyof AdminPaymentFilters>(
    key: K,
    value: AdminPaymentFilters[K]
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Check if filters are active
  const hasActiveFilters = Object.keys(localFilters).some(
    (key) => key !== 'page' && key !== 'limit' && localFilters[key as keyof AdminPaymentFilters]
  );

  return (
    <S.FiltersContainer>
      {/* Quick Filters */}
      <S.QuickFilters>
        {/* Venue Filter (Primary) */}
        <S.FilterField className='flex-1' minWidth='16rem'>
          <S.FilterLabel>
            <Building />
            {t('admin.payments.filters.venue')}
          </S.FilterLabel>
          <S.FilterSelect
            value={localFilters.venueId || ''}
            onChange={(e) => updateFilter('venueId', e.target.value || undefined)}
          >
            <option value=''>{t('admin.payments.filters.allVenues')}</option>
            {venues.map((venue) => (
              <option key={venue.value} value={venue.value}>
                {venue.label}
              </option>
            ))}
          </S.FilterSelect>
        </S.FilterField>

        {/* Status Filter */}
        <S.FilterField minWidth='12rem'>
          <S.FilterLabel>{t('admin.payments.filters?.status')}</S.FilterLabel>
          <S.FilterSelect
            value={localFilters?.status || ''}
            onChange={(e) => updateFilter('status', (e.target.value as PaymentStatus) || undefined)}
          >
            <option value=''>{t('admin.payments.filters.allStatuses')}</option>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </S.FilterSelect>
        </S.FilterField>

        {/* Search */}
        <S.FilterField minWidth='16rem'>
          <S.FilterLabel>
            <Search />
            {t('admin.payments.filters.search')}
          </S.FilterLabel>
          <S.FilterInput
            placeholder='Usuario, email, descripción...'
            type='text'
            value={localFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
          />
        </S.FilterField>

        {/* Expand/Collapse Button */}
        <S.ExpandButtonContainer>
          <Button variant='outlined' onClick={() => setIsExpanded(!isExpanded)}>
            {t('admin.payments.filters.advanced')}
          </Button>
        </S.ExpandButtonContainer>
      </S.QuickFilters>

      {/* Advanced Filters (Collapsible) */}
      {isExpanded && (
        <Card>
          <S.AdvancedFiltersCard>
            <S.AdvancedFiltersGrid>
              {/* Date From */}
              <S.FilterField>
                <S.FilterLabel>
                  <Calendar />
                  {t('admin.payments.filters.dateFrom')}
                </S.FilterLabel>
                <S.FilterInput
                  type='date'
                  value={localFilters.dateFrom || ''}
                  onChange={(e) => updateFilter('dateFrom', e.target.value || undefined)}
                />
              </S.FilterField>

              {/* Date To */}
              <S.FilterField>
                <S.FilterLabel>
                  <Calendar />
                  {t('admin.payments.filters.dateTo')}
                </S.FilterLabel>
                <S.FilterInput
                  type='date'
                  value={localFilters.dateTo || ''}
                  onChange={(e) => updateFilter('dateTo', e.target.value || undefined)}
                />
              </S.FilterField>

              {/* Min Amount */}
              <S.FilterField>
                <S.FilterLabel>
                  <DollarSign />
                  {t('admin.payments.filters.minAmount')}
                </S.FilterLabel>
                <S.FilterInput
                  min='0'
                  placeholder='0.00'
                  step='0.01'
                  type='number'
                  value={localFilters.amount?.min || ''}
                  onChange={(e) =>
                    updateFilter('amount', {
                      ...localFilters.amount,
                      min: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </S.FilterField>

              {/* Max Amount */}
              <S.FilterField>
                <S.FilterLabel>
                  <DollarSign />
                  {t('admin.payments.filters.maxAmount')}
                </S.FilterLabel>
                <S.FilterInput
                  min='0'
                  placeholder='0.00'
                  step='0.01'
                  type='number'
                  value={localFilters.amount?.max || ''}
                  onChange={(e) =>
                    updateFilter('amount', {
                      ...localFilters.amount,
                      max: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </S.FilterField>

              {/* User ID */}
              <S.FilterField>
                <S.FilterLabel>{t('admin.payments.filters.userId')}</S.FilterLabel>
                <S.FilterInput
                  placeholder='user_123456'
                  type='text'
                  value={localFilters.userId || ''}
                  onChange={(e) => updateFilter('userId', e.target.value || undefined)}
                />
              </S.FilterField>
            </S.AdvancedFiltersGrid>
          </S.AdvancedFiltersCard>
        </Card>
      )}

      {/* Action Buttons */}
      <S.ActionsContainer>
        <S.ActionsLeft>
          <Button onClick={handleApplyFilters}>{t('common.apply')}</Button>

          {hasActiveFilters && (
            <Button variant='outlined' onClick={handleClearFilters}>
              {t('common.clear')}
            </Button>
          )}
        </S.ActionsLeft>

        <S.ActionsRight>
          {hasActiveFilters && (
            <S.ActiveFiltersIndicator>
              <Filter />
              {t('admin.payments.filters.active')}
            </S.ActiveFiltersIndicator>
          )}
        </S.ActionsRight>
      </S.ActionsContainer>
    </S.FiltersContainer>
  );
};
