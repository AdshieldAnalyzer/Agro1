# Voice Accessibility System - Quick Reference

## 🚀 Quick Start

### Installation (Already Done)
The system is already integrated into `App.jsx`. No additional setup needed!

### Basic Usage

**Wrap page sections:**
```jsx
import VoiceReadableRegion from '../components/VoiceReadableRegion';

<VoiceReadableRegion label="My Section" priority={2}>
  <h1>Section Title</h1>
  <p>Content here...</p>
</VoiceReadableRegion>
```

**Use the hook:**
```jsx
import { useVoiceAccessibility } from '../context/VoiceAccessibilityContext';

const { speak, readPage, isListening } = useVoiceAccessibility();

<button onClick={() => speak('Hello!')}>Speak</button>
```

---

## 📢 Voice Commands (What Users Can Say)

### Navigation (Go To...)
| Command | Goes To |
|---------|---------|
| "go home" | Homepage |
| "crop rankings" | Crop Rankings Page |
| "farmer league" | Farmer League Page |
| "AI methodology" | AI Methodology Page |
| "treatment" | Treatment Rankings Page |
| "regional" | Regional Intelligence Page |

### Reading (Read...)
| Command | Action |
|---------|--------|
| "read page" | Read all content on page |
| "read headings" | Read only page headings |
| "repeat" | Repeat last spoken text |
| "stop" | Stop current speech |

### Accessibility (Adjust...)
| Command | Action |
|---------|--------|
| "increase text" | Make text larger |
| "decrease text" | Make text normal |
| "high contrast" | Toggle high contrast mode |
| "slow down" | Reduce speech speed (0.6) |
| "speed up" | Increase speech speed (1.1) |

### Help
| Command | Action |
|---------|--------|
| "help" | Show help overlay with all commands |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Alt + V** | Toggle voice listening |
| **Alt + R** | Read current page |
| **Alt + H** | Show/hide help overlay |
| **Escape** | Stop speaking |

---

## 🎯 Component Props

### VoiceReadableRegion
```jsx
<VoiceReadableRegion 
  label="Unique Section Name"  // Required: identifier
  priority={2}                 // Optional: 0-100 (lower = read first)
  className="my-class"         // Optional: CSS classes
>
  {children}
</VoiceReadableRegion>
```

**Priority Guide:**
- `1` - Hero/Main content (read first)
- `2-4` - Primary sections
- `5-8` - Secondary sections
- `10+` - Footer/Less important

---

## 🪝 Hook: useVoiceAccessibility

### All Available Values & Methods
```jsx
const {
  // STATE
  isListening,          // boolean - is microphone listening?
  isSpeaking,           // boolean - is system speaking?
  lastTranscript,       // string - last command heard
  interimTranscript,    // string - current being heard
  isSupported,          // boolean - browser supports feature
  pageTitle,            // string - current page name
  textSize,             // 'normal' | 'large' | 'small'
  isHighContrast,       // boolean - is high contrast on?
  speechRate,           // 0.6 - 1.1
  showHelpOverlay,      // boolean - show help screen?

  // METHODS
  speak(text, options), // Speak text aloud
  stopSpeaking(),       // Stop current speech
  startListening(),     // Start voice recognition
  stopListening(),      // Stop voice recognition
  readPage(),           // Read entire page content
  
  // ADVANCED
  registerRegion(label, priority, element),
  unregisterRegion(label),
  setShowHelpOverlay(boolean),
  setTextSize(size),
} = useVoiceAccessibility();
```

---

## 🔊 Text-to-Speech Options

### Basic Usage
```jsx
const { speak } = useVoiceAccessibility();
speak('Hello, this is a message');
```

### With Options
```jsx
speak('Slower speech', {
  rate: 0.6,      // 0.1 to 2.0
  pitch: 1.0,     // 0.1 to 2.0  
  lang: 'en-IN',  // Language code
  priority: 'interrupt' // Cancel ongoing speech
});
```

---

## 🐛 Common Patterns

### Show Status While Listening
```jsx
const { isListening, isSpeaking } = useVoiceAccessibility();

{isListening && <p>🎤 Listening...</p>}
{isSpeaking && <p>🔊 Speaking...</p>}
```

### Execute Code When Command Heard
```jsx
const { lastTranscript } = useVoiceAccessibility();

useEffect(() => {
  if (lastTranscript.toLowerCase().includes('my command')) {
    // Do something
  }
}, [lastTranscript]);
```

### Announce Form Results
```jsx
const { speak } = useVoiceAccessibility();

const handleFormSubmit = async (data) => {
  const result = await submitForm(data);
  if (result.success) {
    speak('Your form was submitted successfully!');
  } else {
    speak('There was an error. Please try again.');
  }
};
```

### Read Custom Content
```jsx
const { speak } = useVoiceAccessibility();

const handleClickCrop = (cropName) => {
  const description = `${cropName} is a high-yield crop...`;
  speak(description);
};
```

---

## ✅ Best Practices

### For Page Structure
1. **Always wrap main sections** with `VoiceReadableRegion`
2. **Use semantic HTML** - `<section>`, `<article>`, `<main>`
3. **Add ARIA labels** to complex components:
   ```jsx
   <div role="region" aria-label="Crop data table">...</div>
   ```

### For Voice Commands
1. **Keep commands simple** and natural
2. **Provide feedback** when commands execute
3. **Test with users** - especially accessibility users
4. **Document custom commands** if you add them

### For Accessibility
1. **Always provide text alternatives**
2. **Use high contrast colors** for low-vision users
3. **Test with keyboard navigation**
4. **Test with screen readers** (NVDA, JAWS, VoiceOver)

---

## 🔧 Common Customizations

### Change Default Speech Rate
In `VoiceAccessibilityContext.jsx`:
```javascript
const [speechRate, setSpeechRate] = useState(0.8); // Was 0.85
```

### Add Custom Voice Command
In `processVoiceCommand()` function:
```javascript
if (lowerTranscript.includes('my custom command')) {
  speak('Command executed');
  // Your logic here
  return;
}
```

### Add New Page Route
In `pageNames` object:
```javascript
const pageNames = {
  '/my-new-page': 'My New Page Name',
  // ...
};
```

### Change Page Announcement Delay
In the `useEffect` for announcements:
```javascript
const timer = setTimeout(() => {
  // Announcement code
}, 800); // Change 800 to your desired delay
```

---

## 🧪 Testing Checklist

- [ ] Tested "read page" command
- [ ] Tested all navigation commands
- [ ] Tested keyboard shortcuts work
- [ ] Tested high contrast mode
- [ ] Tested text size changes
- [ ] Tested speech rate changes
- [ ] Tested on mobile browser
- [ ] Tested with screen reader
- [ ] Verified ARIA labels present
- [ ] Tested in noisy environment
- [ ] Verified error messages are clear

---

## 📱 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best experience |
| Edge | ✅ Full | Chromium-based |
| Safari | ⚠️ Partial | iOS 14.5+, limited voice recognition |
| Firefox | ❌ Limited | Speech Synthesis only, no recognition |
| Mobile | ✅ Works | Android Chrome, iOS Safari |

---

## 🚨 Troubleshooting

### Microphone Not Working
```
❌ "Listening doesn't start"
✅ Check browser allows microphone permission
✅ Ensure HTTPS connection (required)
✅ Try a different browser
```

### Speech Not Being Heard
```
❌ "Nothing is spoken"
✅ Check volume/speaker settings
✅ Try different speech rate (slower)
✅ Check speechSynthesis is supported
```

### Commands Not Recognized
```
❌ "Voice command not executing"
✅ Speak clearly and naturally
✅ Check keyword is correct (say "help" for list)
✅ Try in quieter environment
✅ Check browser language setting
```

### Text Size Not Changing
```
❌ "Text remains same size after command"
✅ Clear browser cache
✅ Check CSS classes are applied
✅ Verify Tailwind is processing text-lg class
```

---

## 📚 Additional Resources

- **Full Documentation**: See `VOICE_ACCESSIBILITY_GUIDE.md`
- **Code Examples**: See `VOICE_INTEGRATION_EXAMPLE.jsx`
- **API Reference**: See `VoiceAccessibilityContext.jsx` comments
- **UI Component**: See `VoiceAssistantUI.jsx` for styling customization

---

## 🎓 Learning Path

1. **Start Here** → Read this Quick Reference
2. **Next** → Look at `VOICE_INTEGRATION_EXAMPLE.jsx`
3. **Then** → Use `VoiceReadableRegion` in your pages
4. **Advanced** → Customize commands and add features
5. **Expert** → Read `VOICE_ACCESSIBILITY_GUIDE.md` full docs

---

## 💡 Pro Tips

✨ **Wrap important content** in `VoiceReadableRegion` with appropriate priorities

✨ **Provide voice feedback** when users interact with important components

✨ **Test your page** by saying "read page" - it should read all critical content

✨ **Use keyboard shortcuts** when testing - faster than voice

✨ **Always include ARIA labels** on custom components

✨ **Announce form results** - users love hearing confirmation

---

## 📞 Need Help?

- Check the **examples** in `VOICE_INTEGRATION_EXAMPLE.jsx`
- Read **full docs** in `VOICE_ACCESSIBILITY_GUIDE.md`
- **Test keyboard shortcuts** to verify system is working
- Say **"help"** in the app to see all voice commands
