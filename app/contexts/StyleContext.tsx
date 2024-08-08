'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultStyles } from '../components/DefaultStyle';
import { useSession } from 'next-auth/react';
import { StyleType, StyleContextType, StyleProviderProps } from '../interface/styles';

// Define the Session type here, extending from next-auth
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const StyleContext = createContext<StyleContextType>({
  styles: defaultStyles,
  setStyles: () => {},
  isLoading: true,
});

export function StyleProvider({ children }: StyleProviderProps) {
  const [styles, setStyles] = useState<StyleType>(defaultStyles);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchStyles() {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/getStyle');
          if (!res.ok) {
            throw new Error('Failed to fetch styles');
          }
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setStyles(data);
          }
        } catch (error) {
          console.error('Error fetching styles:', error);
          // Fallback to default styles if there's an error
          setStyles(defaultStyles);
        }
      } else {
        // Use default styles for non-logged-in users
        setStyles(defaultStyles);
      }
      setIsLoading(false);
    }

    fetchStyles();
  }, [status]);

  return (
    <StyleContext.Provider value={{ styles, setStyles, isLoading }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyles() {
  return useContext(StyleContext);
}