import { Metadata } from 'next';

import { AboutPage } from '@mod-landing/presentation/components';

export const metadata: Metadata = {
  description:
    'Conoce más sobre ReservApp - La plataforma integral de reservaciones para hoteles pequeños y su ecosistema de servicios en México.',
  keywords:
    'sobre nosotros, ReservApp, plataforma reservaciones, hoteles México, ecosistema turístico',
  title: 'Acerca de Nosotros | ReservApp',
};

export default function About() {
  return <AboutPage />;
}
