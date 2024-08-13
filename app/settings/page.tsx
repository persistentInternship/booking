"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      console.error('User not authenticated');
      return;
    }
    try {
      console.log('Submitting style:', style);
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
      console.log('Style saved successfully:', data.message);
      setStyles({ ...currentStyles, ...style });
      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error saving style:', error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <>  
    <Navbar />
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
        <div className="flex justify-between">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Save   
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Save and Apply
          </button>
        </div>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default Form;