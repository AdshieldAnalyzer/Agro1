/**
 * VOICE ACCESSIBILITY INTEGRATION EXAMPLE
 * 
 * This file shows how to use the Voice Accessibility System
 * in your React components and pages.
 * 
 * Copy these patterns to your own components!
 */

import React from 'react';
import { useVoiceAccessibility } from './src/context/VoiceAccessibilityContext';
import VoiceReadableRegion from './src/components/VoiceReadableRegion';

// ============================================================================
// EXAMPLE 1: Using VoiceReadableRegion to wrap page sections
// ============================================================================

export function ExamplePage1() {
  return (
    <div>
      {/* Hero section - Read first (priority 1) */}
      <VoiceReadableRegion label="Hero Section" priority={1}>
        <section className="hero">
          <h1>Welcome to FarmAssist</h1>
          <p>AI-powered agricultural intelligence for modern farmers</p>
          <button>Get Started</button>
        </section>
      </VoiceReadableRegion>

      {/* Features section - Read second (priority 2) */}
      <VoiceReadableRegion label="Features" priority={2}>
        <section className="features">
          <h2>Key Features</h2>
          <div>
            <h3>Crop Rankings</h3>
            <p>Real-time intelligent crop rankings based on local conditions</p>
          </div>
          <div>
            <h3>Treatment Advice</h3>
            <p>AI-powered fertilizer and pesticide recommendations</p>
          </div>
        </section>
      </VoiceReadableRegion>

      {/* Testimonials - Read third (priority 5) */}
      <VoiceReadableRegion label="Testimonials" priority={5}>
        <section className="testimonials">
          <h2>What Farmers Say</h2>
          <p>"FarmAssist increased my yield by 40%"</p>
          <p>"The best tool for modern farming"</p>
        </section>
      </VoiceReadableRegion>

      {/* Footer - Read last (priority 10) */}
      <VoiceReadableRegion label="Footer" priority={10}>
        <footer>
          <p>© 2024 FarmAssist. All rights reserved.</p>
        </footer>
      </VoiceReadableRegion>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Using useVoiceAccessibility hook in a component
// ============================================================================

export function VoiceControlledComponent() {
  const {
    isListening,
    isSpeaking,
    speak,
    stopSpeaking,
    startListening,
    readPage,
    lastTranscript,
  } = useVoiceAccessibility();

  return (
    <div className="voice-controls">
      <h3>Voice Controls Demo</h3>

      {/* Show listening status */}
      {isListening && <p>🎤 Listening...</p>}
      {isSpeaking && <p>🔊 Speaking...</p>}

      {/* Show last command */}
      {lastTranscript && <p>You said: {lastTranscript}</p>}

      {/* Manual control buttons */}
      <button onClick={startListening} disabled={isListening}>
        Start Listening
      </button>

      <button onClick={stopSpeaking} disabled={!isSpeaking}>
        Stop Speaking
      </button>

      <button onClick={readPage}>
        Read This Page
      </button>

      <button onClick={() => speak('Hello! This is a test message.')}>
        Speak Test Message
      </button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Custom voice command handling
// ============================================================================

export function CustomVoiceFeature() {
  const { speak, lastTranscript } = useVoiceAccessibility();

  React.useEffect(() => {
    // React to voice commands in your component
    if (lastTranscript.toLowerCase().includes('show data')) {
      speak('Displaying data analytics dashboard');
      // Trigger your custom logic here
    }
  }, [lastTranscript, speak]);

  return (
    <div>
      <h3>Custom Feature</h3>
      <p>Say "show data" to trigger this feature</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Conditional voice announcement
// ============================================================================

export function FormWithVoiceAnnouncement() {
  const { speak } = useVoiceAccessibility();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Announce form submission via voice
    speak('Your form has been submitted successfully. Please wait for confirmation.');
    
    setIsSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" placeholder="Enter your name" />
      </label>
      <button type="submit">Submit</button>
      
      {isSubmitted && (
        <p>✓ Form submitted! Check your email for confirmation.</p>
      )}
    </form>
  );
}

// ============================================================================
// EXAMPLE 5: Voice-friendly data table
// ============================================================================

export function VoiceAccessibleTable() {
  const crops = [
    { name: 'Mustard', yield: '1.9t/ha', confidence: '94%' },
    { name: 'Soybean', yield: '1.8t/ha', confidence: '92%' },
    { name: 'Wheat', yield: '3.2t/ha', confidence: '88%' },
  ];

  return (
    <VoiceReadableRegion label="Crop Rankings Table" priority={3}>
      <section>
        <h2>Top Crop Rankings</h2>
        
        {/* Use semantic table structure for better voice reading */}
        <table role="table" aria-label="Crop rankings by yield and confidence">
          <thead>
            <tr>
              <th>Crop Name</th>
              <th>Expected Yield</th>
              <th>Confidence Score</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop, idx) => (
              <tr key={idx}>
                <td>{crop.name}</td>
                <td>{crop.yield}</td>
                <td>{crop.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add a description for voice users */}
        <p aria-label="Table summary">
          The table above shows the top three crops ranked by expected yield and AI confidence score.
        </p>
      </section>
    </VoiceReadableRegion>
  );
}

// ============================================================================
// EXAMPLE 6: Interactive component with voice feedback
// ============================================================================

export function InteractiveVoiceComponent() {
  const { speak } = useVoiceAccessibility();
  const [selectedCrop, setSelectedCrop] = React.useState(null);

  const crops = ['Mustard', 'Soybean', 'Wheat', 'Cotton'];

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    
    // Provide voice feedback
    speak(`You selected ${crop}. Click for more details.`);
  };

  return (
    <VoiceReadableRegion label="Crop Selector" priority={4}>
      <div>
        <h3>Select a Crop</h3>
        <div className="crop-buttons">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => handleSelectCrop(crop)}
              aria-pressed={selectedCrop === crop}
              aria-label={`Select ${crop} crop`}
            >
              {crop}
            </button>
          ))}
        </div>
        
        {selectedCrop && (
          <div className="crop-details" role="region" aria-live="polite">
            <h4>{selectedCrop} Details</h4>
            <p>Detailed information about {selectedCrop} appears here...</p>
          </div>
        )}
      </div>
    </VoiceReadableRegion>
  );
}

// ============================================================================
// EXAMPLE 7: Full page integration (realistic)
// ============================================================================

export function CompletePageExample() {
  return (
    <div className="page">
      {/* Header - might be outside VoiceReadableRegion if it's global */}
      <header role="banner">
        <h1 aria-label="FarmAssist - AI Agricultural Intelligence Platform">
          FarmAssist
        </h1>
      </header>

      <main role="main">
        {/* Hero with call to action - High priority (read first) */}
        <VoiceReadableRegion label="Hero Section" priority={1}>
          <section className="hero">
            <h1>Transform Your Farming with AI</h1>
            <p>
              Get real-time crop rankings, treatment recommendations, and regional
              insights powered by advanced machine learning.
            </p>
            <button className="cta-button">Explore Now</button>
          </section>
        </VoiceReadableRegion>

        {/* Main content */}
        <VoiceReadableRegion label="Main Content" priority={2}>
          <section className="content">
            <h2>How It Works</h2>
            <ol>
              <li>Input your location and crop type</li>
              <li>Our AI analyzes local conditions</li>
              <li>Get personalized recommendations</li>
              <li>Implement and track results</li>
            </ol>
          </section>
        </VoiceReadableRegion>

        {/* Featured data */}
        <VoiceReadableRegion label="Featured Crops" priority={3}>
          <section className="featured">
            <h2>Featured Crops This Season</h2>
            <p>Mustard, Soybean, and Wheat are trending this season...</p>
          </section>
        </VoiceReadableRegion>

        {/* Testimonials - lower priority */}
        <VoiceReadableRegion label="Success Stories" priority={5}>
          <section className="testimonials">
            <h2>Success Stories</h2>
            <p>"Increased yield by 40%" - Farmer Ram</p>
            <p>"Saved 2 weeks of work" - Farmer Priya</p>
          </section>
        </VoiceReadableRegion>

        {/* Call to action at bottom */}
        <VoiceReadableRegion label="Sign Up Section" priority={7}>
          <section className="signup">
            <h2>Get Started Today</h2>
            <p>Join thousands of farmers using FarmAssist</p>
            <button>Sign Up Free</button>
          </section>
        </VoiceReadableRegion>
      </main>

      {/* Footer - read last */}
      <VoiceReadableRegion label="Footer" priority={10}>
        <footer role="contentinfo">
          <p>© 2024 FarmAssist. All rights reserved.</p>
          <nav>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </nav>
        </footer>
      </VoiceReadableRegion>
    </div>
  );
}

// ============================================================================
// USAGE NOTES
// ============================================================================

/**
 * WHEN TO USE VoiceReadableRegion:
 * - Wrap important page sections (hero, content, footer)
 * - Use priority numbers (0-100): lower numbers read first
 * - Typical priorities: 1=Hero, 2=Main Content, 5=Features, 10=Footer
 * 
 * WHEN TO USE useVoiceAccessibility:
 * - Control voice features programmatically
 * - React to voice commands in your component
 * - Provide custom voice feedback
 * - Check if user is listening/speaking
 * 
 * VOICE COMMAND EXAMPLES (users can say):
 * - "read page" → Reads all content in priority order
 * - "go home" → Navigates to homepage
 * - "crop rankings" → Navigates to crop page
 * - "increase text" → Makes text larger
 * - "high contrast" → Toggles high contrast mode
 * - "help" → Shows help overlay
 * 
 * KEYBOARD SHORTCUTS:
 * - Alt + V → Toggle listening
 * - Alt + R → Read page
 * - Alt + H → Show help
 * - Escape → Stop speaking
 */
