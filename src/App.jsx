import React from "react";
import Routes from "./Routes";
import { LanguageProvider } from "./context/LanguageContext";
import FontLoader from "./components/FontLoader";
import LanguageChangeToast from "./components/LanguageChangeToast";

function App() {
  return (
    <LanguageProvider>
      <FontLoader />
      <LanguageChangeToast />
      <Routes />
    </LanguageProvider>
  );
}

export default App;
