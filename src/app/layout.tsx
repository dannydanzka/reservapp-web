import { Lato, Montserrat } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

import { AppProviders } from '@providers/AppProviders';

// Configure Google Fonts with optimal loading
const montserrat = Montserrat({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
});

const lato = Lato({
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  authors: [{ name: 'ReservApp Team' }],
  description: 'Complete reservation management system for modern businesses',
  keywords: ['reservations', 'booking', 'management', 'business'],
  title: 'ReservApp - Modern Reservation Management',
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root layout component for the entire application.
 * Provides global providers and styles.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='es'>
      <head>
        <link href='/icons/favicon.ico' rel='icon' sizes='any' />
        <meta content='#3b82f6' name='theme-color' />
      </head>
      <body className={`${montserrat.variable} ${lato.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
