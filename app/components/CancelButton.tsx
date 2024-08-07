'use client';

import React from 'react';
import { useStyles } from '../contexts/StyleContext';

interface CancelButtonProps {
  bookingId: number;
}

export default function CancelButton({ bookingId }: CancelButtonProps) {
  const { styles } = useStyles();

  const handleCancel = () => {
    // Implement cancellation logic here
    alert(`Cancellation logic to be implemented for booking ${bookingId}`);
  };

  return (
    <button 
      style={{ 
        backgroundColor: styles.buttonColor, 
        color: styles.textColor
      }}
      className={`px-4 py-2 rounded transition-colors hover:bg-[${styles.hoverColor}]`}
      onClick={handleCancel}
    >
      Cancel Booking
    </button>
  );
}