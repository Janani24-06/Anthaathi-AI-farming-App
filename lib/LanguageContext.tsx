import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from '@/assets/lang/en.json';
import ta from '@/assets/lang/ta.json';

type Translations = typeof en;

interface LanguageContextValue {
  language: string;
  setLanguage: (lang: string) => Promise<void>;
  t: Translations;
}

const translations: Record<string, Translations> = { en, ta };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState('en');

  useEffect(() => {
    AsyncStorage.getItem('language').then((lang) => {
      if (lang) setLang(lang);
    });
  }, []);

  const setLanguage = async (lang: string) => {
    setLang(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const t = useMemo(() => translations[language] || en, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
