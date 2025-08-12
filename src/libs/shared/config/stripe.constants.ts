export const STRIPE_CONFIG = {
  API_VERSION: '2023-10-16' as const,
  LOCALE: 'es' as const,
};

export const STRIPE_APPEARANCE_OPTIONS = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#0570de',
    colorBackground: '#ffffff',
    colorText: '#30313d',
    colorDanger: '#df1b41',
    fontFamily: 'Ideal Sans, system-ui, sans-serif',
    spacingUnit: '2px',
    borderRadius: '4px',
  },
};
