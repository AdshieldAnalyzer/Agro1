import React, { useState, useEffect } from 'react';
import { useLanguage, useTranslation } from '../context/LanguageContext';

const LanguageChangeToast = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [previousLanguage, setPreviousLanguage] = useState(language);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (language !== previousLanguage) {
      setShowToast(true);
      setPreviousLanguage(language);
      
      // Auto-hide toast after 2 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [language, previousLanguage]);

  if (!showToast) return null;

  const currentLangName = t('nav.selectLanguage');
  const nativeLanguageName = t('common.loading'); // Fallback, using a simple key
  
  // Get the native label from translations
  const languages = {
    'en-IN': 'English',
    'hi-IN': 'हिंदी में भाषा बदली',
    'ta-IN': 'தமிழ்',
    'te-IN': 'తెలుగు',
    'mr-IN': 'मराठीमध्ये',
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-left-4 duration-300">
      <div className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 font-medium">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>
          {language === 'en-IN' && 'Language changed to English'}
          {language === 'hi-IN' && 'भाषा हिंदी में बदली गई'}
          {language === 'ta-IN' && 'மொழி தமிழ் இல் மாற்றப்பட்டுள்ளது'}
          {language === 'te-IN' && 'భాష తెలుగువకు మార్చబడింది'}
          {language === 'mr-IN' && 'भाषा मराठीमध्ये बदली गई'}
          {!['en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'mr-IN'].includes(language) && 'Language changed'}
        </span>
      </div>
    </div>
  );
};

export default LanguageChangeToast;
