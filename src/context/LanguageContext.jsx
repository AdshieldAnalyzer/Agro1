import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

export const LANGUAGES = [
  { code: 'en-IN', label: 'English',    nativeLabel: 'English',    flag: '🇮🇳' },
  { code: 'hi-IN', label: 'Hindi',      nativeLabel: 'हिंदी',       flag: '🇮🇳' },
  { code: 'gu-IN', label: 'Gujarati',   nativeLabel: 'ગુજરાતી',     flag: '🇮🇳' },
  { code: 'pa-IN', label: 'Punjabi',    nativeLabel: 'ਪੰਜਾਬੀ',      flag: '🇮🇳' },
  { code: 'mr-IN', label: 'Marathi',    nativeLabel: 'मराठी',       flag: '🇮🇳' },
  { code: 'te-IN', label: 'Telugu',     nativeLabel: 'తెలుగు',      flag: '🇮🇳' },
  { code: 'ta-IN', label: 'Tamil',      nativeLabel: 'தமிழ்',       flag: '🇮🇳' },
  { code: 'kn-IN', label: 'Kannada',   nativeLabel: 'ಕನ್ನಡ',       flag: '🇮🇳' },
];

const LanguageContext = createContext({
  language: 'en-IN',
  setLanguage: () => {},
  currentLang: LANGUAGES[0]
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en-IN';
    
    const savedLang = localStorage.getItem('agroyield-lang');
    if (savedLang) return savedLang;
    
    // Auto-detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const supportedLang = LANGUAGES.find(l => l.code.startsWith(browserLang.substring(0, 2)));
    return supportedLang?.code || 'en-IN';
  });
  
  const handleSetLanguage = (code) => {
    setLanguage(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agroyield-lang', code);
      // Apply language-specific CSS class for fonts and sizing
      document.body.className = document.body.className.replace(/lang-\w+-\w+/g, '');
      document.body.classList.add(`lang-${code}`);
    }
  };
  
  // Set initial language class
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = document.body.className.replace(/lang-\w+-\w+/g, '');
      document.body.classList.add(`lang-${language}`);
    }
  }, []);
  
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Fallback to English if key missing in selected language
    if (!value) {
      let fallback = translations['en-IN'];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      value = fallback || key;
    }
    
    // Handle interpolation: replace {{paramName}} with actual values
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        value = value.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      });
    }
    
    return value;
  };
  
  return { t, language };
};

export default LanguageContext;
