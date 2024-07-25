import React from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex space-x-1">
        <div className="w-3 h-3 bg-gray-900 rounded-full animate-ping"></div>
        <div className="w-3 h-3 bg-gray-900 rounded-full animate-ping delay-75"></div>
        <div className="w-3 h-3 bg-gray-900 rounded-full animate-ping delay-150"></div>
      </div>
    </div>
  );
}