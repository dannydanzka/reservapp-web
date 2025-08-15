'use client';

import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle,
  Mail,
  Monitor,
  TrendingUp,
  Users,
} from 'lucide-react';

import type { NotificationStats } from '@mod-admin/infrastructure/services/admin/adminNotificationService';

export interface NotificationStatsProps {
  stats: NotificationStats['data'] | null;
  summary: {
    totalNotifications: number;
    unreadCount: number;
    emailCount: number;
    systemCount: number;
  } | null;
  isLoading?: boolean;
  userRole?: string;
}

export const NotificationStatsComponent = ({
  isLoading = false,
  stats,
  summary,
  userRole,
}: NotificationStatsProps) => {
  if (isLoading && !stats && !summary) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        {[...Array(4)].map((_, i) => (
          <div className='bg-white rounded-lg border border-gray-200 p-6 animate-pulse' key={i}>
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
            <div className='h-8 bg-gray-200 rounded w-1/2 mb-2' />
            <div className='h-3 bg-gray-200 rounded w-full' />
          </div>
        ))}
      </div>
    );
  }

  // Use summary data if available, otherwise use stats overview
  const currentSummary = summary || stats?.overview;

  if (!currentSummary) {
    return null;
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  const formatPercentage = (num: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((num / total) * 100)}%`;
  };

  const statsCards = [
    {
      color: 'blue',
      description:
        userRole === 'SUPER_ADMIN'
          ? 'Todas las notificaciones del sistema'
          : 'Notificaciones de tus venues',
      icon: Bell,
      title: 'Total de Notificaciones',
      value: formatNumber(currentSummary.totalNotifications),
    },
    {
      color: 'red',
      description: `${formatPercentage(currentSummary.unreadCount, currentSummary.totalNotifications)} del total`,
      icon: AlertCircle,
      title: 'No Leídas',
      value: formatNumber(currentSummary.unreadCount),
    },
    {
      color: 'green',
      description: `${formatPercentage('emailCount' in currentSummary ? currentSummary.emailCount : currentSummary.emailNotifications, currentSummary.totalNotifications)} del total`,
      icon: Mail,
      title: 'Emails Enviados',
      value: formatNumber(
        'emailCount' in currentSummary
          ? currentSummary.emailCount
          : currentSummary.emailNotifications
      ),
    },
    {
      color: 'purple',
      description: `${formatPercentage('systemCount' in currentSummary ? currentSummary.systemCount : currentSummary.systemNotifications, currentSummary.totalNotifications)} del total`,
      icon: Monitor,
      title: 'Solo Sistema',
      value: formatNumber(
        'systemCount' in currentSummary
          ? currentSummary.systemCount
          : currentSummary.systemNotifications
      ),
    },
  ];

  return (
    <div className='space-y-6 mb-6'>
      {/* Main Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;

          return (
            <div
              className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'
              key={index}
            >
              <div className='flex items-center justify-between mb-4'>
                <div
                  className={`p-2 rounded-lg ${
                    stat.color === 'blue'
                      ? 'bg-blue-100 text-blue-600'
                      : stat.color === 'red'
                        ? 'bg-red-100 text-red-600'
                        : stat.color === 'green'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-purple-100 text-purple-600'
                  }`}
                >
                  <IconComponent className='w-6 h-6' />
                </div>
              </div>

              <div className='space-y-1'>
                <p className='text-sm font-medium text-gray-600'>{stat.title}</p>
                <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
                <p className='text-sm text-gray-500'>{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats from API */}
      {stats && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Notifications by Type */}
          {Object.keys(stats.byType).length > 0 && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Activity className='w-5 h-5 mr-2 text-blue-600' />
                Por Tipo de Notificación
              </h3>
              <div className='space-y-3'>
                {Object.entries(stats.byType)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([type, count]) => {
                    const percentage = Math.round(
                      (count / stats.overview.totalNotifications) * 100
                    );

                    return (
                      <div className='flex items-center justify-between' key={type}>
                        <div className='flex-1'>
                          <div className='flex justify-between items-center mb-1'>
                            <span className='text-sm font-medium text-gray-700'>
                              {type
                                .replace(/_/g, ' ')
                                .toLowerCase()
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <span className='text-sm text-gray-500'>{count}</span>
                          </div>
                          <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                              className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Top Users */}
          {stats.topUsers && stats.topUsers.length > 0 && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Users className='w-5 h-5 mr-2 text-green-600' />
                Usuarios Más Activos
              </h3>
              <div className='space-y-3'>
                {stats.topUsers.slice(0, 5).map((userStat, index) => (
                  <div
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                    key={userStat.userId}
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index === 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : index === 1
                              ? 'bg-gray-100 text-gray-800'
                              : index === 2
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {userStat.user
                            ? `${userStat.user.firstName} ${userStat.user.lastName}`
                            : `Usuario ${userStat.userId.slice(-8)}`}
                        </p>
                        {userStat.user && (
                          <p className='text-sm text-gray-500'>{userStat.user.email}</p>
                        )}
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-900'>{userStat.notificationCount}</p>
                      <p className='text-sm text-gray-500'>notificaciones</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Types Distribution */}
          {stats.emailTypes && Object.keys(stats.emailTypes).length > 0 && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Mail className='w-5 h-5 mr-2 text-purple-600' />
                Tipos de Email Enviados
              </h3>
              <div className='space-y-3'>
                {Object.entries(stats.emailTypes)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emailType, count]) => {
                    const percentage = Math.round(
                      (count / stats.overview.emailNotifications) * 100
                    );

                    return (
                      <div className='flex items-center justify-between' key={emailType}>
                        <div className='flex-1'>
                          <div className='flex justify-between items-center mb-1'>
                            <span className='text-sm font-medium text-gray-700 capitalize'>
                              {emailType.replace(/_/g, ' ')}
                            </span>
                            <span className='text-sm text-gray-500'>{count}</span>
                          </div>
                          <div className='w-full bg-gray-200 rounded-full h-2'>
                            <div
                              className='bg-purple-500 h-2 rounded-full transition-all duration-300'
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Period Summary */}
          {stats.period && (
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <TrendingUp className='w-5 h-5 mr-2 text-indigo-600' />
                Resumen del Período
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Período:</span>
                  <span className='font-medium capitalize'>{stats.period}</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Rol del usuario:</span>
                  <span className='font-medium'>{stats.userRole}</span>
                </div>

                {stats.adminVenuesCount !== null && (
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Venues administrados:</span>
                    <span className='font-medium'>{stats.adminVenuesCount}</span>
                  </div>
                )}

                <div className='flex justify-between items-center'>
                  <span className='text-gray-600'>Tasa de lectura:</span>
                  <span className='font-medium text-green-600'>
                    {formatPercentage(stats.overview.readCount, stats.overview.totalNotifications)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
