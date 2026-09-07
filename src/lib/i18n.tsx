import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Translations, 
  TRANSLATIONS, 
  CATEGORY_TRANSLATIONS, 
  CONDITION_TRANSLATIONS, 
  STATUS_TRANSLATIONS,
  COMMON_LOCATIONS_I18N
} from './translations';
import { Category, Condition, ProductStatus } from '../types';

const LANGUAGE_STORAGE_KEY = 'makhzooni_language_v1';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: Translations;
  getCategoryName: (category: Category | string) => string;
  getConditionName: (condition: Condition | string) => string;
  getStatusName: (status: ProductStatus | string) => string;
  getCommonLocations: () => string[];
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'fr' || saved === 'ar') return saved;
    } catch {
      // ignore
    }
    return 'ar'; // Default Arabic
  });

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ar;

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  };

  // Keep <html> lang and dir attributes synchronized
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // Update document title dynamically based on language
    if (lang === 'fr') {
      document.title = 'MonStock - Gestion d\'inventaire & Rentabilité Vinted';
    } else {
      document.title = 'مخزوني - إدارة المخزون والأرباح';
    }
  }, [lang, dir]);

  const getCategoryName = (category: Category | string): string => {
    return CATEGORY_TRANSLATIONS[lang]?.[category] || category;
  };

  const getConditionName = (condition: Condition | string): string => {
    return CONDITION_TRANSLATIONS[lang]?.[condition] || condition;
  };

  const getStatusName = (status: ProductStatus | string): string => {
    return STATUS_TRANSLATIONS[lang]?.[status] || status;
  };

  const getCommonLocations = (): string[] => {
    return COMMON_LOCATIONS_I18N[lang] || COMMON_LOCATIONS_I18N.ar;
  };

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        dir,
        t,
        getCategoryName,
        getConditionName,
        getStatusName,
        getCommonLocations,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
