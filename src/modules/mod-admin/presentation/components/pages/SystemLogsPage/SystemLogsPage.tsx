'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@libs/presentation/components/Button';
import { DASHBOARD_CONFIG, getRefreshInterval } from '@libs/shared/constants/dashboard.constants';
import { SystemLogCategory, SystemLogLevel } from '@prisma/client';
import { TextField } from '@libs/presentation/components/TextField';
import { useSystemLogs } from '@libs/presentation/hooks/useSystemLogs';
import { useTranslation } from '@libs/shared/i18n';

import type {
  LogCategoryBadgeProps,
  LogDetailModalProps,
  LogLevelBadgeProps,
  LogStatsCardProps,
  SystemLogFilters,
  SystemLogItem,
  SystemLogsPageProps,
} from './SystemLogsPage.interfaces';

import {
  AutoRefreshIndicator,
  CategoryBadge,
  CodeBlock,
  Container,
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
  FilterActions,
  FilterGroup,
  FilterLabel,
  FiltersGrid,
  FiltersHeader,
  FiltersSection,
  FiltersTitle,
  Header,
  HeaderActions,
  HeaderContent,
  LoadingContainer,
  LoadingSpinner,
  LogLevelBadge,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalSection,
  ModalSectionTitle,
  ModalTitle,
  PaginationActions,
  PaginationContainer,
  PaginationInfo,
  StatsCard,
  StatsContent,
  StatsGrid,
  StatsIcon,
  StatsLabel,
  StatsTrend,
  StatsValue,
  Subtitle,
  Table,
  TableActions,
  TableCell,
  TableContent,
  TableHead,
  TableHeader as TableHeaderDiv,
  TableHeader,
  TableRow,
  TableSection,
  TableTitle,
  Title,
} from './SystemLogsPage.styled';

// Level badge component
const LevelBadge: React.FC<LogLevelBadgeProps> = ({ level }) => (
  <LogLevelBadge $level={level}>{level}</LogLevelBadge>
);

// Category badge component
const CategoryBadgeComponent: React.FC<LogCategoryBadgeProps> = ({ category }) => (
  <CategoryBadge>{category.replace(/_/g, ' ')}</CategoryBadge>
);

// Stats card component
const StatsCardComponent: React.FC<LogStatsCardProps> = ({
  color = 'primary',
  icon,
  title,
  trend,
  trendLabel,
  value,
}) => (
  <StatsCard $color={color}>
    <StatsIcon $color={color}>{icon}</StatsIcon>
    <StatsContent>
      <StatsLabel>{title}</StatsLabel>
      <StatsValue>{value}</StatsValue>
      {trend !== undefined && (
        <StatsTrend $positive={trend >= 0}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
        </StatsTrend>
      )}
    </StatsContent>
  </StatsCard>
);

// Log detail modal component
const LogDetailModal: React.FC<LogDetailModalProps> = ({ isOpen, log, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen || !log) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t('systemLogs.modal.title')}</ModalTitle>
          <Button size='small' variant='text' onClick={onClose}>
            ✕
          </Button>
        </ModalHeader>
        <ModalBody>
          <ModalSection>
            <ModalSectionTitle>{t('systemLogs.modal.basicInfo')}</ModalSectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>{t('systemLogs.fields.level')}</DetailLabel>
                <DetailValue>
                  <LevelBadge level={log.level} />
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('systemLogs.fields.category')}</DetailLabel>
                <DetailValue>
                  <CategoryBadgeComponent category={log.category} />
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('systemLogs.fields.eventType')}</DetailLabel>
                <DetailValue>{log.eventType}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('systemLogs.fields.timestamp')}</DetailLabel>
                <DetailValue>{new Date(log.createdAt).toLocaleString()}</DetailValue>
              </DetailItem>
            </DetailGrid>
          </ModalSection>

          <ModalSection>
            <ModalSectionTitle>{t('systemLogs.modal.message')}</ModalSectionTitle>
            <CodeBlock>{log.message}</CodeBlock>
          </ModalSection>

          {(log.userEmail || log.userId) && (
            <ModalSection>
              <ModalSectionTitle>{t('systemLogs.modal.userContext')}</ModalSectionTitle>
              <DetailGrid>
                {log.userEmail && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.userEmail')}</DetailLabel>
                    <DetailValue>{log.userEmail}</DetailValue>
                  </DetailItem>
                )}
                {log.userName && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.userName')}</DetailLabel>
                    <DetailValue>{log.userName}</DetailValue>
                  </DetailItem>
                )}
                {log.userRole && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.userRole')}</DetailLabel>
                    <DetailValue>{log.userRole}</DetailValue>
                  </DetailItem>
                )}
                {log.userId && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.userId')}</DetailLabel>
                    <DetailValue>{log.userId}</DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            </ModalSection>
          )}

          {(log.ipAddress || log.userAgent || log.requestId) && (
            <ModalSection>
              <ModalSectionTitle>{t('systemLogs.modal.requestContext')}</ModalSectionTitle>
              <DetailGrid>
                {log.ipAddress && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.ipAddress')}</DetailLabel>
                    <DetailValue>{log.ipAddress}</DetailValue>
                  </DetailItem>
                )}
                {log.requestId && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.requestId')}</DetailLabel>
                    <DetailValue>{log.requestId}</DetailValue>
                  </DetailItem>
                )}
                {log.sessionId && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.sessionId')}</DetailLabel>
                    <DetailValue>{log.sessionId}</DetailValue>
                  </DetailItem>
                )}
                {log.statusCode && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.statusCode')}</DetailLabel>
                    <DetailValue>{log.statusCode}</DetailValue>
                  </DetailItem>
                )}
                {log.duration && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.duration')}</DetailLabel>
                    <DetailValue>{log.duration}ms</DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
              {log.userAgent && (
                <DetailItem style={{ gridColumn: '1 / -1' }}>
                  <DetailLabel>{t('systemLogs.fields.userAgent')}</DetailLabel>
                  <CodeBlock>{log.userAgent}</CodeBlock>
                </DetailItem>
              )}
            </ModalSection>
          )}

          {(log.resourceType || log.resourceId) && (
            <ModalSection>
              <ModalSectionTitle>{t('systemLogs.modal.resourceContext')}</ModalSectionTitle>
              <DetailGrid>
                {log.resourceType && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.resourceType')}</DetailLabel>
                    <DetailValue>{log.resourceType}</DetailValue>
                  </DetailItem>
                )}
                {log.resourceId && (
                  <DetailItem>
                    <DetailLabel>{t('systemLogs.fields.resourceId')}</DetailLabel>
                    <DetailValue>{log.resourceId}</DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            </ModalSection>
          )}

          {log.errorMessage && (
            <ModalSection>
              <ModalSectionTitle>{t('systemLogs.modal.errorInfo')}</ModalSectionTitle>
              {log.errorCode && (
                <DetailItem>
                  <DetailLabel>{t('systemLogs.fields.errorCode')}</DetailLabel>
                  <DetailValue>{log.errorCode}</DetailValue>
                </DetailItem>
              )}
              <DetailItem>
                <DetailLabel>{t('systemLogs.fields.errorMessage')}</DetailLabel>
                <CodeBlock>{log.errorMessage}</CodeBlock>
              </DetailItem>
              {log.stackTrace && (
                <DetailItem>
                  <DetailLabel>{t('systemLogs.fields.stackTrace')}</DetailLabel>
                  <CodeBlock>{log.stackTrace}</CodeBlock>
                </DetailItem>
              )}
            </ModalSection>
          )}

          {(log.oldValues || log.newValues || log.metadata) && (
            <ModalSection>
              <ModalSectionTitle>{t('systemLogs.modal.dataContext')}</ModalSectionTitle>
              {log.oldValues && (
                <DetailItem>
                  <DetailLabel>{t('systemLogs.fields.oldValues')}</DetailLabel>
                  <CodeBlock>{JSON.stringify(log.oldValues, null, 2)}</CodeBlock>
                </DetailItem>
              )}
              {log.newValues && (
                <DetailItem>
                  <DetailLabel>{t('systemLogs.fields.newValues')}</DetailLabel>
                  <CodeBlock>{JSON.stringify(log.newValues, null, 2)}</CodeBlock>
                </DetailItem>
              )}
              {log.metadata && (
                <DetailItem>
                  <DetailLabel>{t('systemLogs.fields.metadata')}</DetailLabel>
                  <CodeBlock>{JSON.stringify(log.metadata, null, 2)}</CodeBlock>
                </DetailItem>
              )}
            </ModalSection>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export const SystemLogsPage: React.FC<SystemLogsPageProps> = () => {
  const { t } = useTranslation();

  // State management
  const [filters, setFilters] = useState<SystemLogFilters>({
    category: [],
    dateFrom: '',
    dateTo: '',
    eventType: '',
    level: [],
    resourceId: '',
    resourceType: '',
    search: '',
    userId: '',
  });

  const [selectedLog, setSelectedLog] = useState<SystemLogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout>();

  // Custom hooks
  const {
    cleanupLogs,
    error,
    exportLogs,
    fetchLogs,
    fetchStats,
    hasMore,
    loading,
    logs,
    stats,
    total,
    totalPages,
  } = useSystemLogs();

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchLogs(filters, page);
  }, [filters, page, fetchLogs]);

  // Load stats on component mount
  useEffect(() => {
    fetchStats('day');
  }, [fetchStats]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && DASHBOARD_CONFIG.AUTO_REFRESH_ENABLED) {
      // Use configured refresh interval with development adjustments
      const refreshIntervalMs = getRefreshInterval(DASHBOARD_CONFIG.LOGS_REFRESH_INTERVAL);

      const interval = setInterval(() => {
        fetchLogs(filters, page);
        fetchStats('day');
      }, refreshIntervalMs);

      setRefreshInterval(interval);

      return () => {
        clearInterval(interval);
      };
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(undefined);
    }
  }, [autoRefresh, filters, page, fetchLogs, fetchStats, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // Event handlers
  const handleFilterChange = useCallback((key: keyof SystemLogFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page when filters change
  }, []);

  const handleLevelFilterChange = useCallback((level: SystemLogLevel, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      level: checked ? [...prev.level, level] : prev.level.filter((l) => l !== level),
    }));
    setPage(1);
  }, []);

  const handleCategoryFilterChange = useCallback(
    (category: SystemLogCategory, checked: boolean) => {
      setFilters((prev) => ({
        ...prev,
        category: checked
          ? [...prev.category, category]
          : prev.category.filter((c) => c !== category),
      }));
      setPage(1);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setFilters({
      category: [],
      dateFrom: '',
      dateTo: '',
      eventType: '',
      level: [],
      resourceId: '',
      resourceType: '',
      search: '',
      userId: '',
    });
    setPage(1);
  }, []);

  const handleRowClick = useCallback((log: SystemLogItem) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLog(null);
  }, []);

  const handleExport = useCallback(async () => {
    await exportLogs(filters);
  }, [exportLogs, filters]);

  const handleCleanup = useCallback(async () => {
    if (window.confirm(t('systemLogs.cleanupConfirm'))) {
      await cleanupLogs(90); // 90 days retention
      fetchLogs(filters, page); // Refresh data
      fetchStats('day'); // Refresh stats
    }
  }, [cleanupLogs, fetchLogs, fetchStats, filters, page, t]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => !prev);
  }, []);

  // Memoized values
  const levelOptions = useMemo(() => Object.values(SystemLogLevel), []);
  const categoryOptions = useMemo(() => Object.values(SystemLogCategory), []);

  const statsCards = useMemo(
    () => [
      {
        color: 'primary' as const,
        icon: '📊',
        title: t('systemLogs.stats.totalLogs'),
        value: stats?.totalLogs.toLocaleString() || '0',
      },
      {
        color: 'warning' as const,
        icon: '⚠️',
        title: t('systemLogs.stats.recentErrors'),
        value: stats?.recentErrors.toLocaleString() || '0',
      },
      {
        color: 'error' as const,
        icon: '🚨',
        title: t('systemLogs.stats.criticalAlerts'),
        value: stats?.criticalAlerts.toLocaleString() || '0',
      },
      {
        color: 'success' as const,
        icon: '⚡',
        title: t('systemLogs.stats.avgResponseTime'),
        value: `${Math.round(stats?.averageResponseTime || 0)}ms`,
      },
    ],
    [stats, t]
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>{t('systemLogs.title')}</Title>
          <Subtitle>{t('systemLogs.description')}</Subtitle>
        </HeaderContent>
        <HeaderActions>
          <AutoRefreshIndicator $active={autoRefresh}>
            {autoRefresh ? t('systemLogs.autoRefreshOn') : t('systemLogs.autoRefreshOff')}
          </AutoRefreshIndicator>
          <Button size='small' variant='outlined' onClick={toggleAutoRefresh}>
            {autoRefresh ? '⏸️' : '▶️'} {t('systemLogs.autoRefresh')}
          </Button>
          <Button size='small' variant='outlined' onClick={handleExport}>
            📁 {t('systemLogs.export')}
          </Button>
          <Button size='small' variant='outlined' onClick={handleCleanup}>
            🗑️ {t('systemLogs.cleanup')}
          </Button>
        </HeaderActions>
      </Header>

      {/* Stats Cards */}
      <StatsGrid>
        {statsCards.map((card, index) => (
          <StatsCardComponent key={index} {...card} />
        ))}
      </StatsGrid>

      {/* Filters Section */}
      <FiltersSection>
        <FiltersHeader>
          <FiltersTitle>{t('systemLogs.filters.title')}</FiltersTitle>
        </FiltersHeader>

        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>{t('systemLogs.filters.search')}</FilterLabel>
            <TextField
              placeholder={t('systemLogs.filters.searchPlaceholder')}
              value={filters.search}
              onChange={(value) => handleFilterChange('search', value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('systemLogs.filters.eventType')}</FilterLabel>
            <TextField
              placeholder={t('systemLogs.filters.eventTypePlaceholder')}
              value={filters.eventType}
              onChange={(value) => handleFilterChange('eventType', value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('systemLogs.filters.userId')}</FilterLabel>
            <TextField
              placeholder={t('systemLogs.filters.userIdPlaceholder')}
              value={filters.userId}
              onChange={(value) => handleFilterChange('userId', value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('systemLogs.filters.dateFrom')}</FilterLabel>
            <TextField
              type='datetime-local'
              value={filters.dateFrom}
              onChange={(value) => handleFilterChange('dateFrom', value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('systemLogs.filters.dateTo')}</FilterLabel>
            <TextField
              type='datetime-local'
              value={filters.dateTo}
              onChange={(value) => handleFilterChange('dateTo', value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>{t('systemLogs.filters.resourceType')}</FilterLabel>
            <TextField
              placeholder={t('systemLogs.filters.resourceTypePlaceholder')}
              value={filters.resourceType}
              onChange={(value) => handleFilterChange('resourceType', value)}
            />
          </FilterGroup>
        </FiltersGrid>

        {/* Level Filters */}
        <FilterGroup>
          <FilterLabel>{t('systemLogs.filters.levels')}</FilterLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {levelOptions.map((level) => (
              <label key={level} style={{ alignItems: 'center', display: 'flex', gap: '0.25rem' }}>
                <input
                  checked={filters.level.includes(level)}
                  type='checkbox'
                  onChange={(e) => handleLevelFilterChange(level, e.target.checked)}
                />
                <LevelBadge level={level} />
              </label>
            ))}
          </div>
        </FilterGroup>

        {/* Category Filters */}
        <FilterGroup>
          <FilterLabel>{t('systemLogs.filters.categories')}</FilterLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categoryOptions.map((category) => (
              <label
                key={category}
                style={{ alignItems: 'center', display: 'flex', gap: '0.25rem' }}
              >
                <input
                  checked={filters.category.includes(category)}
                  type='checkbox'
                  onChange={(e) => handleCategoryFilterChange(category, e.target.checked)}
                />
                <CategoryBadgeComponent category={category} />
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterActions>
          <Button size='small' variant='outlined' onClick={handleResetFilters}>
            {t('systemLogs.filters.reset')}
          </Button>
          <Button size='small' onClick={() => fetchLogs(filters, 1)}>
            {t('systemLogs.filters.apply')}
          </Button>
        </FilterActions>
      </FiltersSection>

      {/* Logs Table */}
      <TableSection>
        <TableHeaderDiv>
          <TableTitle>{t('systemLogs.table.title')}</TableTitle>
          <TableActions>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              {t('systemLogs.table.showing', {
                end: Math.min(page * 50, total),
                start: (page - 1) * 50 + 1,
                total,
              })}
            </span>
          </TableActions>
        </TableHeaderDiv>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        ) : error ? (
          <EmptyState>
            <EmptyStateIcon>❌</EmptyStateIcon>
            <EmptyStateTitle>{t('systemLogs.error.title')}</EmptyStateTitle>
            <EmptyStateDescription>{error}</EmptyStateDescription>
          </EmptyState>
        ) : logs.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>📝</EmptyStateIcon>
            <EmptyStateTitle>{t('systemLogs.empty.title')}</EmptyStateTitle>
            <EmptyStateDescription>{t('systemLogs.empty.description')}</EmptyStateDescription>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableContent>
                <TableHead>
                  <TableRow>
                    <TableHeader>{t('systemLogs.table.timestamp')}</TableHeader>
                    <TableHeader>{t('systemLogs.table.level')}</TableHeader>
                    <TableHeader>{t('systemLogs.table.category')}</TableHeader>
                    <TableHeader>{t('systemLogs.table.eventType')}</TableHeader>
                    <TableHeader>{t('systemLogs.table.message')}</TableHeader>
                    <TableHeader>{t('systemLogs.table.user')}</TableHeader>
                    <TableHeader>{t('systemLogs.table.resource')}</TableHeader>
                    <TableHeader>{t('systemLogs.table.duration')}</TableHeader>
                  </TableRow>
                </TableHead>
                <tbody>
                  {logs.map((log) => (
                    <TableRow $clickable key={log.id} onClick={() => handleRowClick(log)}>
                      <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <LevelBadge level={log.level} />
                      </TableCell>
                      <TableCell>
                        <CategoryBadgeComponent category={log.category} />
                      </TableCell>
                      <TableCell>{log.eventType}</TableCell>
                      <TableCell>
                        <div
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {log.message}
                        </div>
                      </TableCell>
                      <TableCell>{log.userEmail || log.userName || '-'}</TableCell>
                      <TableCell>
                        {log.resourceType && log.resourceId
                          ? `${log.resourceType}:${log.resourceId.substring(0, 8)}...`
                          : '-'}
                      </TableCell>
                      <TableCell>{log.duration ? `${log.duration}ms` : '-'}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </TableContent>
            </Table>

            {/* Pagination */}
            <PaginationContainer>
              <PaginationInfo>
                {t('systemLogs.pagination.info', {
                  end: Math.min(page * 50, total),
                  start: (page - 1) * 50 + 1,
                  total,
                })}
              </PaginationInfo>

              <PaginationActions>
                <Button
                  disabled={page === 1}
                  size='small'
                  variant='outlined'
                  onClick={() => setPage(1)}
                >
                  {t('systemLogs.pagination.first')}
                </Button>
                <Button
                  disabled={page === 1}
                  size='small'
                  variant='outlined'
                  onClick={() => setPage(page - 1)}
                >
                  {t('systemLogs.pagination.previous')}
                </Button>
                <span
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                    padding: '0 1rem',
                  }}
                >
                  {t('systemLogs.pagination.current', { page, totalPages })}
                </span>
                <Button
                  disabled={page === totalPages || !hasMore}
                  size='small'
                  variant='outlined'
                  onClick={() => setPage(page + 1)}
                >
                  {t('systemLogs.pagination.next')}
                </Button>
                <Button
                  disabled={page === totalPages || !hasMore}
                  size='small'
                  variant='outlined'
                  onClick={() => setPage(totalPages)}
                >
                  {t('systemLogs.pagination.last')}
                </Button>
              </PaginationActions>
            </PaginationContainer>
          </>
        )}
      </TableSection>

      {/* Log Detail Modal */}
      <LogDetailModal isOpen={isModalOpen} log={selectedLog} onClose={handleCloseModal} />
    </Container>
  );
};
