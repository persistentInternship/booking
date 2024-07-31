import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useStyles } from '../contexts/StyleContext';

// Define props interface for LoginModal
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// LoginModal component definition
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { styles } = useStyles();
  // State for email and password inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Attempt to sign in using NextAuth
      const result = await signIn('credentials', {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });
      if (result?.error) {
        alert(result.error);
      } else {
        alert('Login successful!');
        onClose();
        window.location.reload(); // Refresh to update session state
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Render login modal
  return (
    <div className={`fixed inset-0 ${styles.backgroundColor} bg-opacity-50 flex items-center justify-center p-4 z-50`}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* Password input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* Form buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className={`${styles.buttonColor} text-white px-4 py-2 rounded`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.buttonColor} text-white px-4 py-2 rounded`}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;