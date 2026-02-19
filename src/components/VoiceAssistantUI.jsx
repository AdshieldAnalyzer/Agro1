import React, { useState, useEffect } from 'react';
import { useVoiceAccessibility } from '../context/VoiceAccessibilityContext';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, BookOpen, X } from 'lucide-react';

const VoiceAssistantUI = () => {
  const {
    isListening,
    isSpeaking,
    lastTranscript,
    interimTranscript,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    readPage,
    showHelpOverlay,
    setShowHelpOverlay,
  } = useVoiceAccessibility();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Show toast when listening starts
  useEffect(() => {
    if (isListening) {
      setIsExpanded(true);
      setShowToast(true);
    }
  }, [isListening]);

  if (!isSupported) return null;

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setIsExpanded(false);
    } else {
      startListening();
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Toast notification */}
      {showToast && isListening && (
        <div className="fixed bottom-24 right-6 z-[9998] animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Listening...
          </div>
        </div>
      )}

      {/* Voice Assistant Widget */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {/* Expandable Panel */}
        {isExpanded && (
          <div className="animate-in fade-in slide-in-from-bottom-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm w-[320px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Voice Assistant</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close voice assistant"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Interim Transcript (while speaking) */}
            {interimTranscript && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">You're saying:</p>
                <p className="text-sm text-gray-400 italic">{interimTranscript}</p>
              </div>
            )}

            {/* Final Transcript */}
            {lastTranscript && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-gray-600 mb-1">Command recognized:</p>
                <p className="text-sm text-gray-900">{lastTranscript}</p>
              </div>
            )}

            {/* Status */}
            <div className="mb-4 text-xs text-gray-600">
              {isListening && (
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                  Listening for commands...
                </span>
              )}
              {isSpeaking && (
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  Speaking...
                </span>
              )}
              {!isListening && !isSpeaking && (
                <span className="text-gray-500">Ready. Click mic to activate.</span>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-2">
              {isSpeaking && (
                <button
                  onClick={() => {
                    stopSpeaking();
                  }}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                  aria-label="Stop speaking"
                >
                  <VolumeX size={16} />
                  Stop Speaking
                </button>
              )}

              <button
                onClick={() => {
                  readPage();
                  setIsExpanded(false);
                }}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                aria-label="Read this page"
              >
                <BookOpen size={16} />
                Read This Page
              </button>

              <button
                onClick={() => {
                  setShowHelpOverlay(true);
                  setIsExpanded(false);
                }}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                aria-label="Show help"
              >
                <HelpCircle size={16} />
                Show Help
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              <p className="mb-1 font-semibold">Keyboard Shortcuts:</p>
              <ul className="space-y-1">
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Alt + V</kbd> Toggle listen
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Alt + R</kbd> Read page
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Esc</kbd> Stop speaking
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Floating Mic Button */}
        <div className="relative">
          {isListening && (
            <>
              <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-75"></span>
              <span className="absolute inset-1 rounded-full bg-green-500 animate-pulse opacity-50" style={{ animationDelay: '0.2s' }}></span>
            </>
          )}
          <button
            onClick={handleMicClick}
            onMouseEnter={() => !isListening && setIsExpanded(true)}
            className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 font-semibold ${
              isListening
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : isSpeaking
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start voice control'}
            title="Voice Control — Click or say 'hey farmassist'"
            role="button"
            aria-pressed={isListening}
          >
            {isListening ? (
              <MicOff size={24} />
            ) : isSpeaking ? (
              <Volume2 size={24} />
            ) : (
              <AnimatedWaveform />
            )}
          </button>
        </div>

        {/* Tooltip */}
        <div className="text-xs text-gray-600 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          {isListening ? 'Stop listening' : 'Click to activate voice'}
        </div>
      </div>

      {/* Help Overlay Modal */}
      {showHelpOverlay && <HelpOverlay onClose={() => setShowHelpOverlay(false)} />}
    </>
  );
};

/**
 * Animated Waveform SVG for the mic button
 */
const AnimatedWaveform = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="2" height="2" fill="currentColor" className="animate-pulse" />
    <rect x="9" y="8" width="2" height="8" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.1s' }} />
    <rect x="15" y="5" width="2" height="14" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
  </svg>
);

/**
 * Help Overlay Component
 */
const HelpOverlay = ({ onClose }) => {
  const { speak } = useVoiceAccessibility();

  const commandCategories = [
    {
      title: 'Navigation Commands',
      commands: [
        { command: 'go home / homepage', description: 'Navigate to homepage' },
        { command: 'crop rankings / crops', description: 'Go to crop rankings page' },
        { command: 'farmer league / community', description: 'Go to farmer league' },
        { command: 'AI methodology / how it works', description: 'Go to AI methodology page' },
        { command: 'treatment / fertilizer', description: 'Go to treatment rankings' },
        { command: 'regional / location', description: 'Go to regional intelligence' },
      ],
    },
    {
      title: 'Reading Commands',
      commands: [
        { command: 'read page / read this', description: 'Read all content on current page' },
        { command: 'read headings', description: 'Read all headings on page' },
        { command: 'repeat / say again', description: 'Repeat last spoken text' },
      ],
    },
    {
      title: 'Accessibility Commands',
      commands: [
        { command: 'increase text / bigger text', description: 'Make text larger' },
        { command: 'decrease text / smaller text', description: 'Make text normal size' },
        { command: 'high contrast', description: 'Toggle high contrast mode' },
        { command: 'slow down / speak slower', description: 'Reduce speech speed' },
        { command: 'speed up / speak faster', description: 'Increase speech speed' },
      ],
    },
    {
      title: 'Control Commands',
      commands: [
        { command: 'stop / stop reading / be quiet', description: 'Stop current speech' },
        { command: 'help / what can i say', description: 'Show this help menu' },
      ],
    },
  ];

  const keyboardShortcuts = [
    { shortcut: 'Alt + V', description: 'Toggle voice listening' },
    { shortcut: 'Alt + R', description: 'Read the current page' },
    { shortcut: 'Alt + H', description: 'Show/hide help menu' },
    { shortcut: 'Escape', description: 'Stop speaking' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Voice Control Help</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close help"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Command Categories */}
          {commandCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded"></span>
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.commands.map((cmd, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{cmd.command}</p>
                      <p className="text-gray-600 text-sm">{cmd.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded"></span>
              Keyboard Shortcuts
            </h3>
            <div className="space-y-3">
              {keyboardShortcuts.map((shortcut, idx) => (
                <div key={idx} className="flex gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-mono font-semibold text-blue-600 text-sm bg-blue-100 px-3 py-1 rounded h-fit">
                    {shortcut.shortcut}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{shortcut.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-bold text-amber-900 mb-2">💡 Tips</h4>
            <ul className="text-sm text-amber-900 space-y-1">
              <li>• Speak clearly and naturally for best results</li>
              <li>• Click the mic button or hover to expand the assistant panel</li>
              <li>• Use keyboard shortcuts for quick access to features</li>
              <li>• All voice commands work in English (en-IN)</li>
              <li>• The system works best in quiet environments</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={() => {
              speak('Help closed');
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Close Help
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantUI;
