'use client';

import { useState, createContext, useContext } from 'react';
import Header from './Header';

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  selectedLanguage: 'de',
  setSelectedLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('de');

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      <Header selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
      <main>
        {children}
      </main>
    </LanguageContext.Provider>
  );
}