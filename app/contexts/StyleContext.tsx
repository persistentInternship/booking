'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { defaultStyles } from '../components/DefaultStyle';


interface StyleContextType {
  styles: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    logoColor: string;
    hoverColor: string;
  };
  setStyles: React.Dispatch<React.SetStateAction<StyleContextType['styles']>>;
}


const StyleContext = createContext<StyleContextType | undefined>(undefined);

interface StyleProviderProps {
  children: React.ReactNode;
  initialStyles?: StyleContextType['styles'];
}

export function StyleProvider({ children, initialStyles = defaultStyles }: StyleProviderProps) {
  const [styles, setStyles] = useState(initialStyles);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const response = await fetch('/api/styles');
        if (!response.ok) {
          throw new Error('Failed to fetch styles');
        }
        const data = await response.json();
        setStyles(data);
      } catch (error) {
        console.error('Error fetching styles:', error);
        // Fallback to initial styles if fetch fails
      }
    }

    // Only fetch if initialStyles are the default styles
    if (JSON.stringify(initialStyles) === JSON.stringify(defaultStyles)) {
      fetchStyles();
    }
  }, [initialStyles]);

  return (
    <StyleContext.Provider value={{ styles, setStyles }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyles() {
  const context = useContext(StyleContext);
  if (context === undefined) {
    throw new Error('useStyles must be used within a StyleProvider');
  }
  return context;
}