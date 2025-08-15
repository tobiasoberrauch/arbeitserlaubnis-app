import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import deCommon from '../locales/de/common.json';
import enCommon from '../locales/en/common.json';
import ukCommon from '../locales/uk/common.json';

export const defaultNS = 'common';
export const resources = {
  de: { common: deCommon },
  en: { common: enCommon },
  uk: { common: ukCommon },
} as const;

i18n.use(initReactI18next).init({
  lng: 'de',
  fallbackLng: 'de',
  ns: ['common'],
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };