'use client'; // Indicates this is a client-side component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import ServiceImages from './ServiceImages';
import LoginModal from './LoginModel';
import { useStyles } from '../contexts/StyleContext';

// Define categories of home services
const categories = [
  { name: "AC & Appliance Repair", icon: "/photo/3.webp" },
  { name: "Cleaning & Pest Control", icon: "/photo/4.webp" },
  { name: "Electrician, Plumber & Carpenter", icon: "/photo/5.webp" },
  { name: "Native Water Purifier", icon: "/photo/6.webp" },
  { name: "Painting & decor", icon: "/photo/7.png" },
  { name: "Wall Panels", icon: "/photo/8.png" },
  { name: "Garden Cleaning", icon: "/photo/gardencleaning.jpg" },
  { name: "House Maid", icon: "/photo/housemaid.avif" },
];

const HomeServices = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data and status
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { styles } = useStyles();

  // Handle click on a service category
  const handleServiceClick = (categoryName: string) => {
    if (status === 'authenticated') {
      router.push(`/services?category=${encodeURIComponent(categoryName)}`);
    } else {
      setShowLoginPrompt(true);
    }
  };

  // Handlers for login modal and prompt
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleOpenLoginModal = () => {
    setShowLoginPrompt(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        {/* Service categories section */}
        <div className="md:w-1/2 p-4">
          <h1 className="text-4xl font-bold mb-4">Home services at your doorstep</h1>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">What are you looking for?</h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => handleServiceClick(category.name)}
                >
                  <img src={category.icon} alt={category.name} className="h-12 w-12 mr-4" />
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Service images section (hidden on mobile) */}
        <div className="md:w-1/2 md:pt-20 hidden md:block">
          <ServiceImages />
        </div>
      </div>

      {/* Login Required Prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">Please log in to view this service.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseLoginPrompt}
                className={`px-4 py-2 ${styles.backgroundColor} ${styles.textColor} rounded hover:opacity-80`}
              >
                Cancel
              </button>
              <button
                onClick={handleOpenLoginModal}
                className={`px-4 py-2 ${styles.buttonColor} ${styles.textColor} rounded hover:opacity-80`}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </div>
  );
};

export default HomeServices;