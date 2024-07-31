import React, { useState } from 'react';
import { useStyles } from '../contexts/StyleContext';

// Define props interface for SignupModal
interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// SignupModal component definition
const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const { styles } = useStyles();
  // State for form inputs
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  // Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if passwords match
    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      // Send signup request to the API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, password: signupPassword, phone: signupPhone }),
      });
      if (response.ok) {
        alert('Signup successful! Please log in.');
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup');
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Render signup modal
  return (
    <div className={`fixed inset-0 ${styles.backgroundColor} bg-opacity-50 flex items-center justify-center p-4 z-50`}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign up</h2>
        <form onSubmit={handleSignup}>
          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
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
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* Confirm Password input */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* Phone Number input */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* Form buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className={`${styles.backgroundColor} ${styles.textColor} px-4 py-2 rounded`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.buttonColor} ${styles.textColor} px-4 py-2 rounded`}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;