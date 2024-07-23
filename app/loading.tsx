'use client'

import { Loading } from 'react-daisyui';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <Loading size="lg" />
    </div>
  );
}