import type { Metadata } from 'next';

import { PrivacyPage } from '@mod-landing/presentation/components';

export const metadata: Metadata = {
  alternates: {
    canonical: '/privacy',
  },
  description:
    'Política de privacidad de ReservApp. Conoce cómo protegemos y utilizamos tus datos personales en nuestra plataforma de reservas.',
  keywords:
    'política de privacidad, protección de datos, LGPD, privacidad, datos personales, ReservApp',
  openGraph: {
    description:
      'Política de privacidad de ReservApp. Conoce cómo protegemos y utilizamos tus datos personales.',
    locale: 'es_MX',
    title: 'Política de Privacidad | ReservApp',
    type: 'website',
  },
  title: 'Política de Privacidad | ReservApp',
};

export default function Privacy() {
  return <PrivacyPage />;
}
