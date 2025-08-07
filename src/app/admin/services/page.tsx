/**
 * Services admin page - Services management for administrators
 * Following the same pattern as other admin pages
 */

import type { Metadata } from 'next';

import { ServicesManagement } from '@/modules/mod-admin/presentation/components/ServicesManagement';

export const metadata: Metadata = {
  description: 'Gestiona y administra todos los servicios de la plataforma',
  title: 'Gestión de Servicios - ReservApp Admin',
};

const ServicesPage = () => {
  return <ServicesManagement />;
};

export default ServicesPage;
