import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  compress: true,

  env: {
    API_URL: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
    CUSTOM_KEY: 'reservapp',
    VERCEL_URL: process.env.VERCEL_URL,
  },

  // Disable Next.js built-in ESLint - we use our own flat config
  eslint: {
    ignoreDuringBuilds: true, // Use our own ESLint configuration
  },

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'lodash',
      'date-fns',
      '@reduxjs/toolkit',
      'react-hook-form',
      'zod',
    ],
  },

  generateEtags: true,

  async headers() {
    return [
      {
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS ?? '*',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
        source: '/api/:path*',
      },
    ];
  },

  images: {
    domains: ['localhost', 'reservapp.com', '127.0.0.1'],
    unoptimized: false,
  },
  // Vercel optimizations
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        destination: '/api/health',
        source: '/health',
      },
      {
        destination: '/api/swagger',
        source: '/swagger',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/app/api'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@core': path.resolve(__dirname, 'src/libs/core'),
      '@data': path.resolve(__dirname, 'src/libs/data'),
      '@domain': path.resolve(__dirname, 'src/libs/domain'),
      '@hooks': path.resolve(__dirname, 'src/libs/presentation/hooks'),
      '@i18n': path.resolve(__dirname, 'src/libs/i18n'),
      '@layouts': path.resolve(__dirname, 'src/libs/presentation/layouts'),
      '@libs': path.resolve(__dirname, 'src/libs'),
      '@mod-admin': path.resolve(__dirname, 'src/modules/mod-admin'),
      '@mod-auth': path.resolve(__dirname, 'src/modules/mod-auth'),
      '@mod-landing': path.resolve(__dirname, 'src/modules/mod-landing'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@presentation': path.resolve(__dirname, 'src/libs/presentation'),
      '@providers': path.resolve(__dirname, 'src/libs/presentation/providers'),
      '@services': path.resolve(__dirname, 'src/libs/services'),
      '@types': path.resolve(__dirname, 'src/libs/types'),
      '@ui': path.resolve(__dirname, 'src/libs/presentation/components'),
    };

    // Tree shaking optimizations
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
        usedExports: true,
      };
    }

    return config;
  },
};

export default nextConfig;
