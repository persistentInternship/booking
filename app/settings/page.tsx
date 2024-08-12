"use client"
import { useState, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
import ToastNotification from '../components/ToastNotification';
import Loading from '../components/Loading';
import { useStyles } from '../contexts/StyleContext';
import { useSession } from "next-auth/react";

interface IStyle {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  logoColor: string;
  hoverColor: string;
  logoname: string;
}

const Form: React.FC = () => {
  const { styles: currentStyles, setStyles } = useStyles();
  const { data: session } = useSession();
  const [style, setStyle] = useState<IStyle>({
    backgroundColor: '',
    textColor: '',
    buttonColor: '',
    logoColor: '',
    hoverColor: '',
    logoname: '',
  });
  const [toastConfig, setToastConfig] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Filter out any properties not in IStyle
    const filteredStyles = Object.keys(style).reduce((acc, key) => {
      if (key in currentStyles) {
        acc[key as keyof IStyle] = currentStyles[key as keyof typeof currentStyles];
      }
      return acc;
    }, {} as IStyle);
    
    setStyle(filteredStyles);
  }, [currentStyles]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStyle({ ...style, [e.target.name]: e.target.value });
  };

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToastConfig({ message, type });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      showToast('User not authenticated', 'error');
      return;
    }
    
    setIsLoading(true);
    showToast('Submitting style configuration...', 'info');

    try {
      const response = await fetch('/api/saveStyle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...style, userId: session?.user?.id ?? 'unknown' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStyles({ ...currentStyles, ...style });
      showToast('Style configuration submitted successfully', 'success');
    } catch (error) {
      console.error('Error saving style:', error);
      showToast('Error submitting style configuration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>  
    <Navbar />
    <ToastNotification config={toastConfig} />
    {isLoading && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
        <Loading />
      </div>
    )}
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Style Configuration</h2>
        {Object.entries(style).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:  </label>
            <div className="flex items-center">
              <input
                type={key === 'logoname' ? 'text' : 'color'}
                name={key}
                value={value}
                onChange={handleChange}
                className={`p-1 border border-gray-300 rounded ${key === 'logoname' ? 'w-full' : 'w-12 h-8 mr-2'}`}
              />
              {key !== 'logoname' && (
                <input
                  type="text"
                  value={value}
                  onChange={handleChange}
                  name={key}
                  className="p-2 border border-gray-300 rounded flex-grow"
                />
              )}
            </div>
          </div>
        ))}
        <button 
          type="submit" 
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default Form;