import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enLanding from '../locales/en/landing.json';
import enAuth from '../locales/en/auth.json';
import enDashboard from '../locales/en/dashboard.json';
import enApplication from '../locales/en/application.json';
import enDocuments from '../locales/en/documents.json';
import enAppointments from '../locales/en/appointments.json';
import enChat from '../locales/en/chat.json';
import enVerify from '../locales/en/verify.json';
import enHelp from '../locales/en/help.json';
import enSettings from '../locales/en/settings.json';
import enNotifications from '../locales/en/notifications.json';

import bnCommon from '../locales/bn/common.json';
import bnLanding from '../locales/bn/landing.json';
import bnAuth from '../locales/bn/auth.json';
import bnDashboard from '../locales/bn/dashboard.json';
import bnApplication from '../locales/bn/application.json';
import bnDocuments from '../locales/bn/documents.json';
import bnAppointments from '../locales/bn/appointments.json';
import bnChat from '../locales/bn/chat.json';
import bnVerify from '../locales/bn/verify.json';
import bnHelp from '../locales/bn/help.json';
import bnSettings from '../locales/bn/settings.json';
import bnNotifications from '../locales/bn/notifications.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        landing: enLanding,
        auth: enAuth,
        dashboard: enDashboard,
        application: enApplication,
        documents: enDocuments,
        appointments: enAppointments,
        chat: enChat,
        verify: enVerify,
        help: enHelp,
        settings: enSettings,
        notifications: enNotifications,
      },
      bn: {
        common: bnCommon,
        landing: bnLanding,
        auth: bnAuth,
        dashboard: bnDashboard,
        application: bnApplication,
        documents: bnDocuments,
        appointments: bnAppointments,
        chat: bnChat,
        verify: bnVerify,
        help: bnHelp,
        settings: bnSettings,
        notifications: bnNotifications,
      },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;

