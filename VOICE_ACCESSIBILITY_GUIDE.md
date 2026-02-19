# FarmAssist Voice Accessibility System

## Overview

A complete, production-ready voice accessibility system for FarmAssist that enables blind and visually impaired users to fully navigate and consume the website using only their voice and ears. The system is built with the Web Speech API (SpeechRecognition and SpeechSynthesis) and React hooks.

## Features

✅ **Full Voice Navigation** - Navigate between all pages using voice commands
✅ **Text-to-Speech (TTS)** - Automatic page announcements and content reading
✅ **Speech Recognition** - Continuous voice command listening
✅ **Page Reading** - Read all content, headings, or specific sections on demand
✅ **Accessibility Controls** - Adjust text size, contrast, and speech speed
✅ **Keyboard Shortcuts** - Alt+V, Alt+R, Alt+H, Escape for power users
✅ **ARIA Compliance** - Screen reader compatible with aria-live regions
✅ **Help System** - Built-in help overlay listing all commands
✅ **High Contrast Mode** - Dedicated mode for low-vision users
✅ **Priority-Based Reading** - VoiceReadableRegions read in importance order

---

## Architecture

### 1. **VoiceAccessibilityContext** (`src/context/VoiceAccessibilityContext.jsx`)

The main provider that manages:
- **Speech Recognition** - Initializes and manages Web Speech API
- **Text-to-Speech** - Handles all voice output with rate/pitch control
- **Command Processing** - Parses and executes voice commands
- **Keyboard Shortcuts** - Alt+V, Alt+R, Alt+H, Escape
- **Page Announcements** - Auto-announces page title and description on route change
- **Accessibility Settings** - Text size, high contrast, speech rate

**Context Values:**
```javascript
{
  isListening: boolean,
  isSpeaking: boolean,
  lastTranscript: string,
  interimTranscript: string,
  isSupported: boolean,
  showHelpOverlay: boolean,
  textSize: 'normal' | 'large' | 'small',
  isHighContrast: boolean,
  speechRate: 0.6 - 1.1,
  lastSpokenText: string,
  pageTitle: string,
  
  // Methods
  speak(text, options),
  stopSpeaking(),
  startListening(),
  stopListening(),
  readPage(),
  processVoiceCommand(transcript),
  registerRegion(label, priority, element),
  unregisterRegion(label),
  setShowHelpOverlay(boolean),
  setTextSize(size),
  ariaLiveRef,
}
```

### 2. **VoiceAssistantUI** (`src/components/VoiceAssistantUI.jsx`)

A floating widget with:
- **Animated Mic Button** - Green pulsing ring when listening
- **Expandable Panel** - Shows transcript, status, quick actions
- **Quick Action Buttons** - Read Page, Stop Speaking, Show Help
- **Keyboard Shortcuts Hint** - Built-in reference
- **Help Overlay Modal** - Complete command reference with keyboard shortcuts
- **Accessibility** - Full ARIA labels and roles

### 3. **VoiceReadableRegion** (`src/components/VoiceReadableRegion.jsx`)

Wrapper component that:
- Registers content sections with the voice system
- Provides priority-based reading order
- Marks elements with `data-voice-content` and `data-voice-label` attributes
- Automatically cleans up on unmount

---

## Usage Guide

### Setup (Already Done in App.jsx)

```jsx
import { VoiceAccessibilityProvider } from './context/VoiceAccessibilityContext';
import VoiceAssistantUI from './components/VoiceAssistantUI';

function App() {
  return (
    <VoiceAccessibilityProvider>
      <Routes />
      <VoiceAssistantUI />
    </VoiceAccessibilityProvider>
  );
}
```

### Using VoiceReadableRegion

Wrap important page sections to enable priority-based reading:

```jsx
import VoiceReadableRegion from '../components/VoiceReadableRegion';

export function MyPage() {
  return (
    <div>
      {/* Priority 1 - Read first */}
      <VoiceReadableRegion label="Hero Section" priority={1}>
        <h1>Welcome to FarmAssist</h1>
        <p>Your AI-powered farming companion</p>
      </VoiceReadableRegion>

      {/* Priority 2 - Read second */}
      <VoiceReadableRegion label="Features" priority={2}>
        <h2>Features</h2>
        <p>Smart crop rankings...</p>
      </VoiceReadableRegion>

      {/* Priority 10 - Read last */}
      <VoiceReadableRegion label="Footer" priority={10}>
        <footer>Copyright 2024</footer>
      </VoiceReadableRegion>
    </div>
  );
}
```

### Using useVoiceAccessibility Hook

```jsx
import { useVoiceAccessibility } from '../context/VoiceAccessibilityContext';

function MyComponent() {
  const {
    isListening,
    isSpeaking,
    speak,
    stopSpeaking,
    startListening,
    readPage,
  } = useVoiceAccessibility();

  return (
    <div>
      <button onClick={startListening}>
        {isListening ? 'Listening...' : 'Click to Listen'}
      </button>
      <button onClick={() => speak('Hello, this is a test')}>
        Speak
      </button>
      <button onClick={readPage}>
        Read Page
      </button>
    </div>
  );
}
```

---

## Voice Commands Reference

### Navigation Commands
- `"go home"` / `"homepage"` → Navigate to /homepage-ai-agricultural-intelligence-platform
- `"crop rankings"` / `"crops"` → Navigate to /crop-championship-center-interactive-rankings
- `"farmer league"` / `"community"` → Navigate to /farmer-success-league-community-leaderboards
- `"AI methodology"` / `"how it works"` → Navigate to /ai-ranking-engine-methodology-showcase
- `"treatment"` / `"fertilizer"` → Navigate to /treatment-rankings-fertilizer-pesticide-intelligence
- `"regional"` / `"location"` → Navigate to /regional-intelligence-center-location-specific-insights

### Reading Commands
- `"read page"` / `"read this"` → Read all page content in priority order
- `"read headings"` → Read only page headings (h1, h2, h3)
- `"repeat"` / `"say again"` → Repeat the last spoken text
- `"stop"` / `"be quiet"` → Stop current speech

### Accessibility Commands
- `"increase text"` / `"bigger text"` → Increase font size
- `"decrease text"` / `"smaller text"` → Decrease font size
- `"high contrast"` → Toggle high contrast mode
- `"slow down"` / `"speak slower"` → Reduce speech rate to 0.6
- `"speed up"` / `"speak faster"` → Increase speech rate to 1.1

### Help & Control
- `"help"` / `"what can I say"` → Show help overlay
- `"commands"` → Show help overlay (alias)

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt + V` | Toggle voice listening on/off |
| `Alt + R` | Read the current page |
| `Alt + H` | Show/hide help overlay |
| `Escape` | Stop current speech |

---

## Speech Recognition Settings

The system uses these Web Speech API settings:
- **Language**: `en-IN` (English - India)
- **Continuous**: `true` - Listens continuously until stopped
- **Interim Results**: `true` - Shows real-time transcript as user speaks
- **Auto Restart**: Stops listening after final transcript

To change language, modify the language in `VoiceAccessibilityContext`:
```javascript
recognition.lang = 'hi-IN'; // For Hindi, for example
```

---

## Text-to-Speech Settings

### Default Settings
- **Rate**: 0.85 (slower for clarity)
- **Pitch**: 1.0 (normal pitch)
- **Language**: en-IN

### Adjustable via Voice Commands
- **Rate**: 0.6 (slow) to 1.1 (fast)
- Can be changed with "slow down" and "speed up" commands

### Custom Speech Options
```javascript
const { speak } = useVoiceAccessibility();

speak('Hello world', {
  rate: 0.7,      // 0.1 to 2.0
  pitch: 1.2,     // 0.0 to 2.0
  lang: 'en-IN',  // Language code
  priority: 'interrupt' // Cancels ongoing speech
});
```

---

## Accessibility Features

### ARIA Compliance
- ✅ `aria-live="polite"` region for screen reader announcements
- ✅ `aria-label` on all interactive elements
- ✅ `aria-pressed` state on toggle buttons
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support

### Screen Reader Compatibility
The system automatically updates an `aria-live` region with every TTS announcement, ensuring screen reader users also benefit from the system.

### High Contrast Mode
Activate with `"high contrast"` command or toggle in code:
```javascript
const { setIsHighContrast } = useVoiceAccessibility();
setIsHighContrast(true);
```

CSS class `.high-contrast` applies:
- Black background, white text
- Bold borders on all elements
- Underlined links
- Larger focus indicators

### Text Size Adjustment
Three sizes available:
- Normal (1rem)
- Large (1.125rem)
- Small (0.875rem)

---

## Page Announcements

When navigating to a new page:
1. System waits 800ms for page to render
2. Reads the page `<h1>` title
3. Reads the first `<p>` paragraph
4. Shows a visual toast (for low-vision users)

Disable by removing the useEffect in VoiceAccessibilityContext that watches `location.pathname`.

---

## Troubleshooting

### Speech Recognition Not Working
1. Check browser compatibility (Chrome, Edge, Safari 15+)
2. Ensure microphone is enabled and working
3. Verify HTTPS connection (required for Web Speech API)
4. Check browser permissions for microphone access

### Text-to-Speech Not Working
1. Check if `window.speechSynthesis` is available
2. Ensure speakers/headphones are connected
3. Try different voice rates (0.6 - 1.1)
4. Test in browser DevTools console: `window.speechSynthesis.getVoices()`

### Commands Not Being Recognized
1. Speak clearly and naturally
2. Avoid background noise
3. Check language setting is correct
4. Try keywords from the help overlay

---

## Performance Considerations

### Memory Management
- Speech Recognition stops listening when not active
- Speech Synthesis is cancelled before new utterances
- Components are cleaned up on unmount
- No memory leaks from event listeners

### Browser Compatibility
- Chrome/Edge: Full support (recommended)
- Safari: Partial support (iOS 14.5+)
- Firefox: Limited support
- Mobile: Works on modern Android and iOS browsers

### Best Practices
1. **For Content Creators**: Always use VoiceReadableRegion for important sections
2. **For Developers**: Test voice commands in quiet environment
3. **For Users**: Allow browser microphone permission on first load
4. **For Accessibility**: Ensure all interactive elements have ARIA labels

---

## Customization

### Change Speech Rate Default
In `VoiceAccessibilityContext.jsx`, modify the initial state:
```javascript
const [speechRate, setSpeechRate] = useState(0.85); // Change to desired rate
```

### Add Custom Voice Commands
In the `processVoiceCommand` function, add your command:
```javascript
if (lowerTranscript.includes('custom command')) {
  // Do something
  speak('Command executed');
  return;
}
```

### Modify Page Names
Update the `pageNames` object in `VoiceAccessibilityContext`:
```javascript
const pageNames = {
  '/your-route': 'Your Page Name',
  // ...
};
```

### Change Help Overlay Layout
Edit the `HelpOverlay` component in `VoiceAssistantUI.jsx` to match your design.

---

## Production Checklist

- ✅ Test voice commands on target browsers
- ✅ Test speech recognition with different accents
- ✅ Test high contrast mode with all pages
- ✅ Verify keyboard shortcuts work
- ✅ Test on mobile devices
- ✅ Verify ARIA labels on new components
- ✅ Test with actual screen readers (NVDA, JAWS, VoiceOver)
- ✅ Set up error logging for speech failures
- ✅ Document custom voice commands for users

---

## API Reference

### VoiceAccessibilityContext Methods

```javascript
// Speech
speak(text, options?)
stopSpeaking()

// Listening
startListening()
stopListening()

// Content
readPage()
registerRegion(label, priority, element)
unregisterRegion(label)

// UI
setShowHelpOverlay(boolean)
setTextSize('normal' | 'large' | 'small')

// Processing
processVoiceCommand(transcript)
```

### VoiceReadableRegion Props

```typescript
interface VoiceReadableRegionProps {
  label: string;           // Unique identifier for the region
  priority?: number;       // 0-100, lower reads first (default: 100)
  children: React.ReactNode;
  className?: string;      // Additional CSS classes
}
```

---

## License & Support

For issues or improvements, contact the accessibility team.

---

## Changelog

### Version 1.0 (Initial Release)
- Complete voice accessibility system
- Text-to-speech with rate control
- Speech recognition with command processing
- Page navigation via voice
- Content reading with priority system
- Accessibility settings (contrast, text size)
- Keyboard shortcuts
- Help overlay with command reference
- ARIA compliance and screen reader support
