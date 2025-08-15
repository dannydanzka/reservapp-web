'use client';

import { useEffect, useState } from 'react';

import { Building, Calendar, Filter, Mail, Search, User, X } from 'lucide-react';

import { Button } from '@ui/Button';
import type { NotificationFilters } from '@mod-admin/infrastructure/services/admin/adminNotificationService';
import { useTranslation } from '@i18n/index';

export interface NotificationFiltersProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: NotificationFilters) => void;
  onClearFilters: () => void;
  notificationTypes: Array<{ value: string; label: string }>;
  emailTypes: Array<{ value: string; label: string }>;
  isLoading?: boolean;
}

export const NotificationFiltersComponent = ({
  emailTypes,
  filters,
  isLoading = false,
  notificationTypes,
  onClearFilters,
  onFiltersChange,
}: NotificationFiltersProps) => {
  const { t } = useTranslation();
  const [localFilters, setLocalFilters] = useState<NotificationFilters>(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update local filters when external filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Check if there are any active filters
  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '' && value !== null
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof NotificationFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    setLocalFilters({});
    onClearFilters();
    setShowAdvanced(false);
  };

  // Format date for input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 mb-6'>
      {/* Main Filters Row */}
      <div className='flex flex-wrap items-center gap-4 mb-4'>
        {/* Search */}
        <div className='flex-1 min-w-[200px]'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              disabled={isLoading}
              placeholder='Buscar en título y mensaje...'
              type='text'
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Read Status */}
        <select
          className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          disabled={isLoading}
          value={localFilters.level || ''}
          onChange={(e) => handleFilterChange('level', e.target.value)}
        >
          <option value=''>Todas las notificaciones</option>
          <option value='unread'>Solo no leídas</option>
          <option value='read'>Solo leídas</option>
        </select>

        {/* Category */}
        <select
          className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          disabled={isLoading}
          value={localFilters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value=''>Todas las categorías</option>
          <option value='email'>Solo emails</option>
          <option value='system'>Solo sistema</option>
        </select>

        {/* Advanced Filters Toggle */}
        <Button
          disabled={isLoading}
          size='small'
          variant='outlined'
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className='w-4 h-4' />
          Filtros avanzados
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button disabled={isLoading} size='small' variant='text' onClick={handleClearAll}>
            <X className='w-4 h-4' />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className='border-t border-gray-200 pt-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {/* Notification Type */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tipo de notificación
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                disabled={isLoading}
                value={localFilters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value=''>Todos los tipos</option>
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* User ID */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <User className='inline w-4 h-4 mr-1' />
                ID de usuario
              </label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                disabled={isLoading}
                placeholder='Filtrar por usuario...'
                type='text'
                value={localFilters.userId || ''}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>

            {/* Start Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <Calendar className='inline w-4 h-4 mr-1' />
                Fecha desde
              </label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                disabled={isLoading}
                type='date'
                value={formatDateForInput(localFilters.startDate)}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>

            {/* End Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                <Calendar className='inline w-4 h-4 mr-1' />
                Fecha hasta
              </label>
              <input
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                disabled={isLoading}
                type='date'
                value={formatDateForInput(localFilters.endDate)}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-sm text-gray-600'>Filtros activos:</span>

            {localFilters.search && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'>
                Búsqueda: "{localFilters.search}"
                <button
                  className='ml-1 text-blue-600 hover:text-blue-800'
                  onClick={() => handleFilterChange('search', '')}
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            )}

            {localFilters.level && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'>
                Estado: {localFilters.level === 'unread' ? 'No leídas' : 'Leídas'}
                <button
                  className='ml-1 text-green-600 hover:text-green-800'
                  onClick={() => handleFilterChange('level', '')}
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            )}

            {localFilters.category && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800'>
                Categoría: {localFilters.category === 'email' ? 'Email' : 'Sistema'}
                <button
                  className='ml-1 text-purple-600 hover:text-purple-800'
                  onClick={() => handleFilterChange('category', '')}
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            )}

            {localFilters.type && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800'>
                Tipo:{' '}
                {notificationTypes.find((t) => t.value === localFilters.type)?.label ||
                  localFilters.type}
                <button
                  className='ml-1 text-orange-600 hover:text-orange-800'
                  onClick={() => handleFilterChange('type', '')}
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            )}

            {localFilters.userId && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800'>
                Usuario: {localFilters.userId}
                <button
                  className='ml-1 text-indigo-600 hover:text-indigo-800'
                  onClick={() => handleFilterChange('userId', '')}
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            )}

            {(localFilters.startDate || localFilters.endDate) && (
              <span className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800'>
                Fechas: {localFilters.startDate} - {localFilters.endDate}
                <button
                  className='ml-1 text-gray-600 hover:text-gray-800'
                  onClick={() => {
                    handleFilterChange('startDate', '');
                    handleFilterChange('endDate', '');
                  }}
                >
                  <X className='w-3 h-3' />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
