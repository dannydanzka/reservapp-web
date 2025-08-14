import React from 'react';

import type { Metadata } from 'next';

import { SystemLogsPage } from '@modules/mod-admin/presentation/components/pages/SystemLogsPage';

export const metadata: Metadata = {
  description:
    'Monitor y administra todos los logs del sistema para mantener la seguridad y rendimiento de ReservApp',
  title: 'Logs del Sistema | ReservApp Admin',
};

/**
 * System Logs Admin Page
 *
 * Comprehensive system monitoring page for SUPER_ADMIN users to:
 * - Monitor all system activities and events
 * - Filter and search through logs
 * - Export logs for compliance
 * - Clean up old logs
 * - View performance metrics
 * - Track security events
 */
export default function AdminSystemLogsPage() {
  return <SystemLogsPage />;
}
