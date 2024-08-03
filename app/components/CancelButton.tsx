'use client';

import React from 'react';

interface CancelButtonProps {
  bookingId: number;
}

export default function CancelButton({ bookingId }: CancelButtonProps) {
  const handleCancel = () => {
    // Implement cancellation logic here
    alert(`Cancellation logic to be implemented for booking ${bookingId}`);
  };

  return (
    <button 
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      onClick={handleCancel}
    >
      Cancel Booking
    </button>
  );
}