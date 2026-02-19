import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGE_FONTS = {
  'en-IN': {
    family: 'Inter',
    url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    class: 'font-inter'
  },
  'hi-IN': {
    family: 'Noto Sans Devanagari',
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap",
    class: 'font-devanagari'
  },
  'mr-IN': {
    family: 'Noto Sans Devanagari',
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap",
    class: 'font-devanagari'
  },
  'ta-IN': {
    family: 'Noto Sans Tamil',
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap",
    class: 'font-tamil'
  },
  'te-IN': {
    family: 'Noto Sans Telugu',
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500;600;700&display=swap",
    class: 'font-telugu'
  },
  'gu-IN': {
    family: 'Noto Sans Gujarati',
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;500;600;700&display=swap",
    class: 'font-gujarati'
  },
  'pa-IN': {
    family: 'Noto Sans Gurmukhi',
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Gurmukhi:wght@400;500;600;700&display=swap",
    class: 'font-gurmukhi'
  },
  'kn-IN': {
    family: 'Noto Sans Kannada',
    url: "https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;500;600;700&display=swap",
    class: 'font-kannada'
  }
};

const FontLoader = () => {
  const { language } = useLanguage();
  
  useEffect(() => {
    const fontConfig = LANGUAGE_FONTS[language] || LANGUAGE_FONTS['en-IN'];
    
    // Remove existing font link if any
    const existingLink = document.getElementById('language-font');
    if (existingLink) {
      existingLink.remove();
    }
    
    // Create and inject new font link
    const link = document.createElement('link');
    link.id = 'language-font';
    link.rel = 'stylesheet';
    link.href = fontConfig.url;
    document.head.appendChild(link);
    
    // Update body class for font styling
    document.body.className = document.body.className.replace(/font-\w+/g, '');
    document.body.classList.add(fontConfig.class);
    
    return () => {
      if (link && link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [language]);
  
  return null;
};

export default FontLoader;
