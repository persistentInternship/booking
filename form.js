import { useState } from 'react';
import mongoose from 'mongoose';
const StyleSchema = new mongoose.Schema({
  backgroundColor: String,
  textColor: String,
  buttonColor: String,
  logoColor: String,
  hoverColor: String,
  logoname: String,
});

const Form = () => {
  const [style, setStyle] = useState({
    backgroundColor: '',
    textColor: '',
    buttonColor: '',
    logoColor: '',
    hoverColor: '',
    logoname: '',
  });

  const handleChange = (e) => {
    setStyle({ ...style, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with style:', style);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Style Configuration</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Background Color:  </label>
          <input
            type="text"
            name="backgroundColor"
            value={style.backgroundColor}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full mt-4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Text Color:  </label>
          <input
            type="text"
            name="textColor"
            value={style.textColor}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full mt-4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Button Color:  </label>
          <input
            type="text"
            name="buttonColor"
            value={style.buttonColor}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full mt-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Logo Color:  </label>
          <input
            type="text"
            name="logoColor"
            value={style.logoColor}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full mt-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Hover Color:  </label>
          <input
            type="text"
            name="hoverColor"
            value={style.hoverColor}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full mt-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Logo Name:  </label>
          <input
            type="text"
            name="logoname"
            value={style.logoname}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full mt-4"
          />
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;