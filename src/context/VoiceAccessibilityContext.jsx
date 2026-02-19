import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * VoiceAccessibilityContext
 * Manages all voice accessibility features including TTS, speech recognition, and command processing
 */
const VoiceAccessibilityContext = createContext(null);

export const VoiceAccessibilityProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [showHelpOverlay, setShowHelpOverlay] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [lastSpokenText, setLastSpokenText] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [voiceReadableRegions, setVoiceReadableRegions] = useState([]);
  
  // Refs
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const ariaLiveRef = useRef(null);
  const commandHistoryRef = useRef([]);

  // Map of page routes to friendly names
  const pageNames = {
    '/homepage-ai-agricultural-intelligence-platform': 'Homepage',
    '/crop-championship-center-interactive-rankings': 'Crop Rankings',
    '/farmer-success-league-community-leaderboards': 'Farmer League',
    '/ai-ranking-engine-methodology-showcase': 'AI Methodology',
    '/treatment-rankings-fertilizer-pesticide-intelligence': 'Treatment Rankings',
    '/regional-intelligence-center-location-specific-insights': 'Regional Intelligence',
    '/': 'Home',
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      
      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        
        if (interim) setInterimTranscript(interim);
        if (final) {
          setLastTranscript(final.trim());
          processVoiceCommand(final.trim());
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
      
      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  /**
   * Text-to-Speech function with cancellation and rate control
   */
  const speak = useCallback((text, options = {}) => {
    if (!window.speechSynthesis) return;
    
    // Default options
    const {
      rate = speechRate,
      pitch = 1.0,
      lang = 'en-IN',
      priority = 'normal'
    } = options;
    
    // Cancel ongoing speech if priority is 'interrupt' or if it's not a queue
    if (priority === 'interrupt' || priority === 'normal') {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setLastSpokenText(text);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
    synthesisRef.current = utterance;
    
    // Update ARIA live region for screen reader compatibility
    if (ariaLiveRef.current) {
      ariaLiveRef.current.textContent = text;
    }
  }, [speechRate]);

  /**
   * Stop speaking
   */
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Start listening
   */
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setInterimTranscript('');
      setLastTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  /**
   * Register a voice-readable region
   */
  const registerRegion = useCallback((label, priority, element) => {
    setVoiceReadableRegions((prev) => [
      ...prev.filter((r) => r.label !== label),
      { label, priority, element }
    ]);
  }, []);

  /**
   * Unregister a voice-readable region
   */
  const unregisterRegion = useCallback((label) => {
    setVoiceReadableRegions((prev) => prev.filter((r) => r.label !== label));
  }, []);

  /**
   * Read page content in priority order
   */
  const readPage = useCallback(() => {
    const regions = [...voiceReadableRegions].sort((a, b) => a.priority - b.priority);
    let fullContent = [];

    // Read regions in priority order
    for (const region of regions) {
      if (region.element) {
        const text = region.element.textContent || '';
        if (text.trim()) {
          fullContent.push(text.trim());
        }
      }
    }

    // If no regions, read all headings and paragraphs
    if (fullContent.length === 0) {
      const headings = document.querySelectorAll('h1, h2, h3');
      const paragraphs = document.querySelectorAll('p');
      
      headings.forEach((h) => {
        if (h.textContent) fullContent.push(h.textContent.trim());
      });
      
      paragraphs.forEach((p) => {
        if (p.textContent) fullContent.push(p.textContent.trim());
      });
    }

    const contentText = fullContent.join('. ');
    if (contentText) {
      speak(contentText, { priority: 'normal' });
    }
  }, [voiceReadableRegions, speak]);

  /**
   * Process voice commands
   */
  const processVoiceCommand = useCallback((transcript) => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Store command in history
    commandHistoryRef.current.push({
      text: transcript,
      timestamp: new Date(),
    });

    // NAVIGATION COMMANDS
    if (
      lowerTranscript.includes('go home') ||
      lowerTranscript.includes('homepage') ||
      lowerTranscript.includes('main page')
    ) {
      navigate('/homepage-ai-agricultural-intelligence-platform');
      speak('Navigating to Homepage');
      return;
    }

    if (
      lowerTranscript.includes('crop rankings') ||
      lowerTranscript.includes('crops') ||
      lowerTranscript.includes('championship')
    ) {
      navigate('/crop-championship-center-interactive-rankings');
      speak('Navigating to Crop Rankings');
      return;
    }

    if (
      lowerTranscript.includes('farmer league') ||
      lowerTranscript.includes('community') ||
      lowerTranscript.includes('leaderboard')
    ) {
      navigate('/farmer-success-league-community-leaderboards');
      speak('Navigating to Farmer League');
      return;
    }

    if (
      lowerTranscript.includes('ai methodology') ||
      lowerTranscript.includes('how it works') ||
      lowerTranscript.includes('algorithm')
    ) {
      navigate('/ai-ranking-engine-methodology-showcase');
      speak('Navigating to AI Methodology');
      return;
    }

    if (
      lowerTranscript.includes('treatment') ||
      lowerTranscript.includes('fertilizer') ||
      lowerTranscript.includes('pesticide')
    ) {
      navigate('/treatment-rankings-fertilizer-pesticide-intelligence');
      speak('Navigating to Treatment Rankings');
      return;
    }

    if (
      lowerTranscript.includes('regional') ||
      lowerTranscript.includes('location') ||
      lowerTranscript.includes('my area')
    ) {
      navigate('/regional-intelligence-center-location-specific-insights');
      speak('Navigating to Regional Intelligence');
      return;
    }

    // PAGE READING COMMANDS
    if (
      lowerTranscript.includes('read page') ||
      lowerTranscript.includes('read this') ||
      lowerTranscript.includes('what\'s on screen')
    ) {
      readPage();
      return;
    }

    if (lowerTranscript.includes('read headings')) {
      const headings = document.querySelectorAll('h1, h2, h3');
      const headingTexts = Array.from(headings)
        .map((h) => h.textContent.trim())
        .filter((text) => text);
      if (headingTexts.length > 0) {
        speak('Here are the headings on this page: ' + headingTexts.join('. '));
      } else {
        speak('No headings found on this page.');
      }
      return;
    }

    // PLAYBACK COMMANDS
    if (
      lowerTranscript.includes('stop') ||
      lowerTranscript.includes('stop reading') ||
      lowerTranscript.includes('be quiet')
    ) {
      stopSpeaking();
      return;
    }

    if (lowerTranscript.includes('repeat') || lowerTranscript.includes('say again')) {
      if (lastSpokenText) {
        speak(lastSpokenText);
      } else {
        speak('There is nothing to repeat.');
      }
      return;
    }

    // ACCESSIBILITY COMMANDS
    if (lowerTranscript.includes('increase text') || lowerTranscript.includes('bigger text')) {
      setTextSize('large');
      document.body.classList.remove('text-normal', 'text-small');
      document.body.classList.add('text-lg');
      speak('Text size increased.');
      return;
    }

    if (lowerTranscript.includes('decrease text') || lowerTranscript.includes('smaller text')) {
      setTextSize('normal');
      document.body.classList.remove('text-lg', 'text-small');
      document.body.classList.add('text-normal');
      speak('Text size decreased.');
      return;
    }

    if (lowerTranscript.includes('high contrast')) {
      const newContrast = !isHighContrast;
      setIsHighContrast(newContrast);
      if (newContrast) {
        document.documentElement.classList.add('high-contrast');
        speak('High contrast mode enabled.');
      } else {
        document.documentElement.classList.remove('high-contrast');
        speak('High contrast mode disabled.');
      }
      return;
    }

    if (lowerTranscript.includes('slow down') || lowerTranscript.includes('speak slower')) {
      setSpeechRate(0.6);
      speak('Speaking rate reduced.', { rate: 0.6 });
      return;
    }

    if (lowerTranscript.includes('speed up') || lowerTranscript.includes('speak faster')) {
      setSpeechRate(1.1);
      speak('Speaking rate increased.', { rate: 1.1 });
      return;
    }

    // HELP COMMAND
    if (lowerTranscript.includes('help') || lowerTranscript.includes('what can i say') || lowerTranscript.includes('commands')) {
      setShowHelpOverlay(true);
      speak('Help overlay opened. Available commands include: go home, crop rankings, farmer league, read page, high contrast, and more. See the help screen for details.');
      return;
    }

    // UNKNOWN COMMAND
    speak('Sorry, I didn\'t understand that command. Say "help" to hear what I can do.');
  }, [navigate, speak, stopSpeaking, readPage, isHighContrast, lastSpokenText]);

  /**
   * Announce page when route changes
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentPageName = pageNames[location.pathname] || 'Unknown Page';
      setPageTitle(currentPageName);
      
      // Get page description
      const h1 = document.querySelector('h1');
      const firstP = document.querySelector('p');
      const pageDescription = h1 ? h1.textContent : '';
      const pageSummary = firstP ? firstP.textContent : '';
      
      const announcement = `Now on ${currentPageName}. ${pageDescription} ${pageSummary}`;
      speak(announcement.substring(0, 300)); // Limit length
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname, speak]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.code === 'KeyV') {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
      if (e.altKey && e.code === 'KeyR') {
        e.preventDefault();
        readPage();
      }
      if (e.altKey && e.code === 'KeyH') {
        e.preventDefault();
        setShowHelpOverlay(!showHelpOverlay);
      }
      if (e.code === 'Escape') {
        e.preventDefault();
        stopSpeaking();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, startListening, stopListening, readPage, showHelpOverlay, stopSpeaking]);

  // Apply text size to body
  useEffect(() => {
    if (textSize === 'large') {
      document.body.classList.add('text-lg');
    } else {
      document.body.classList.remove('text-lg');
    }
  }, [textSize]);

  const contextValue = {
    isListening,
    isSpeaking,
    lastTranscript,
    interimTranscript,
    isSupported,
    showHelpOverlay,
    setShowHelpOverlay,
    textSize,
    setTextSize,
    isHighContrast,
    speechRate,
    setSpeechRate,
    lastSpokenText,
    pageTitle,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    readPage,
    processVoiceCommand,
    registerRegion,
    unregisterRegion,
    ariaLiveRef,
  };

  return (
    <VoiceAccessibilityContext.Provider value={contextValue}>
      {/* ARIA live region for screen reader announcements */}
      <div
        ref={ariaLiveRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      {children}
    </VoiceAccessibilityContext.Provider>
  );
};

/**
 * Hook to use voice accessibility context
 */
export const useVoiceAccessibility = () => {
  const context = useContext(VoiceAccessibilityContext);
  if (!context) {
    throw new Error('useVoiceAccessibility must be used within VoiceAccessibilityProvider');
  }
  return context;
};

export default VoiceAccessibilityContext;
