/**
 * Internationalization (i18n) module
 *
 * Provides translation services and utilities for multi-language support.
 */

export { useTranslation } from './useTranslation';
export type { TranslationKey, Translations } from './useTranslation';

// Export translations data if needed
import translations from './translations.json';

export { translations };
