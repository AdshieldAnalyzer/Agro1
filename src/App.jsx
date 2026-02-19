import React from "react";
import Routes from "./Routes";
import VoiceAssistantUI from "./components/VoiceAssistantUI";
import { LanguageProvider } from "./context/LanguageContext";
import { VoiceAccessibilityProvider } from "./context/VoiceAccessibilityContext";

function App() {
  return (
    <LanguageProvider>
      <VoiceAccessibilityProvider>
        <Routes />
        <VoiceAssistantUI />
      </VoiceAccessibilityProvider>
    </LanguageProvider>
  );
}

export default App;
