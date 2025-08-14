import { Metadata } from 'next';

import { TermsPage } from '@mod-landing/presentation/components';

export const metadata: Metadata = {
  description:
    'Términos y Condiciones de ReservApp. Términos justos y transparentes para pequeños negocios hoteleros. Sin letra pequeña, comisiones claras y beneficios para nuevos usuarios.',
  keywords:
    'términos y condiciones, ReservApp, política legal, comisiones transparentes, pequeños hoteles, registro gratuito, términos justos',
  title: 'Términos y Condiciones | ReservApp - Términos Justos y Transparentes',
};

export default function Terms() {
  return <TermsPage />;
}
