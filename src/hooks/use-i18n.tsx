
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import es from '@/lib/i18n/es.json';
import en from '@/lib/i18n/en.json';

const translations: { [key: string]: any } = { es, en };

type Language = 'es' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    // Set language from localStorage or browser settings on initial load
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['es', 'en'].includes(storedLang)) {
      setLanguageState(storedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      setLanguageState(browserLang === 'es' ? 'es' : 'en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let translation = translations[language];

    for (const k of keys) {
      translation = translation?.[k];
      if (translation === undefined) {
        // Fallback to English if translation is not found
        let fallback = translations['en'];
        for (const fk of keys) {
          fallback = fallback?.[fk];
          if (fallback === undefined) return key;
        }
        translation = fallback;
        break;
      }
    }
    
    if (typeof translation !== 'string') return key;

    if (replacements) {
        return Object.keys(replacements).reduce((acc, currentKey) => {
            const regex = new RegExp(`{${currentKey}}`, 'g');
            return acc.replace(regex, String(replacements[currentKey]));
        }, translation);
    }

    return translation;

  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
