'use client';

import React from 'react';
import { useStyles } from '../contexts/StyleContext';

// Loading component to display a loading animation
export default function Loading() {
  const { styles } = useStyles();

  return (
    // Container for centering the loading animation
    <div className="flex justify-center items-center h-screen">
      {/* Wrapper for the loading dots */}
      <div className="flex space-x-1">
        {/* First loading dot */}
        <div className={`w-3 h-3 ${styles.backgroundColor} rounded-full animate-ping`}></div>
        {/* Second loading dot with a slight delay */}
        <div className={`w-3 h-3 ${styles.backgroundColor} rounded-full animate-ping delay-75`}></div>
        {/* Third loading dot with a longer delay */}
        <div className={`w-3 h-3 ${styles.backgroundColor} rounded-full animate-ping delay-150`}></div>
      </div>
    </div>
  );
}