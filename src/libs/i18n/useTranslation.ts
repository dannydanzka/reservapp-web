import { useCallback } from 'react';

import translations from './translations.json';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

export const useTranslation = () => {
  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams & { returnObjects?: boolean }): any => {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation key "${key}" not found`);
          return key;
        }
      }

      // Handle array return for features lists - cast to any to avoid TS issues
      if (params?.returnObjects && Array.isArray(value)) {
        return value as any;
      }

      if (typeof value !== 'string') {
        // If it's an array and returnObjects is true, return the array
        if (Array.isArray(value) && params?.returnObjects) {
          return value as any;
        }
        console.warn(`Translation key "${key}" is not a string`);
        return key;
      }

      if (params) {
        return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
          return params[paramKey]?.toString() || match;
        });
      }

      return value;
    },
    []
  );

  return { t };
};
