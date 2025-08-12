import { Metadata } from 'next';

import { PaymentsDashboard } from '@mod-admin/presentation/components';

export const metadata: Metadata = {
  description: 'Administra pagos, reembolsos y estados de pago de la plataforma ReservApp',
  title: 'Gestión de Pagos - Admin | ReservApp',
};

export default function AdminPaymentsPage() {
  return <PaymentsDashboard />;
}
