import React, { useRef, useEffect } from 'react';
import { useVoiceAccessibility } from '../context/VoiceAccessibilityContext';

/**
 * VoiceReadableRegion Component
 * Wrapper component that registers its content with the voice accessibility system
 * 
 * @param {string} label - The label for this region (e.g., "Hero Section")
 * @param {number} priority - Priority order for reading (lower number = read first)
 * @param {React.ReactNode} children - Content to be voice-accessible
 * @param {string} className - Optional CSS classes
 */
const VoiceReadableRegion = ({ label, priority = 100, children, className = '', ...props }) => {
  const { registerRegion, unregisterRegion } = useVoiceAccessibility();
  const regionRef = useRef(null);

  useEffect(() => {
    if (regionRef.current && label) {
      // Register this region with the voice accessibility provider
      registerRegion(label, priority, regionRef.current);

      // Cleanup: unregister when component unmounts
      return () => {
        unregisterRegion(label);
      };
    }
  }, [label, priority, registerRegion, unregisterRegion]);

  return (
    <div
      ref={regionRef}
      data-voice-content
      data-voice-label={label}
      data-voice-priority={priority}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default VoiceReadableRegion;
