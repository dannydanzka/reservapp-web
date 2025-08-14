import type { Metadata } from 'next';

import { HelpPage } from '@mod-landing/presentation/components';

export const metadata: Metadata = {
  description:
    'Encuentra respuestas a tus preguntas sobre ReservApp. Centro de ayuda completo con guías, FAQs y soporte para usuarios y negocios.',
  keywords: ['ayuda', 'soporte', 'FAQ', 'guías', 'reservaciones', 'hoteles pequeños', 'ReservApp'],
  openGraph: {
    description:
      'Encuentra respuestas a tus preguntas sobre ReservApp. Centro de ayuda completo con guías, FAQs y soporte.',
    siteName: 'ReservApp',
    title: 'Centro de Ayuda | ReservApp',
    type: 'website',
    url: 'https://reservapp.mx/help',
  },
  title: 'Centro de Ayuda | ReservApp',
  twitter: {
    card: 'summary_large_image',
    description:
      'Encuentra respuestas a tus preguntas sobre ReservApp. Centro de ayuda completo con guías, FAQs y soporte.',
    title: 'Centro de Ayuda | ReservApp',
  },
};

export default function HelpPageRoute() {
  return <HelpPage />;
}
