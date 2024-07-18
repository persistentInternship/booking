import React from 'react';

const services = [
  { name: "Women's Salon & Spa", icon: "/photo/1.webp" },
  { name: "Men's Salon & Massage", icon: "/photo/2.webp" },
  { name: "AC & Appliance Repair", icon: "/photo/3.webp" },
  { name: "Cleaning & Pest Control", icon: "/photo/4.webp" },
  { name: "Electrician, Plumber & Carpenter", icon: "/photo/5.webp" },
  { name: "Native Water Purifier", icon: "/photo/6.webp" },
  { name: "Painting & decor", icon: "/photo/7.png" },
  { name: "Wall Panels", icon: "/photo/8.png" },
];

const HomeServices = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-4">
          <h1 className="text-4xl font-bold mb-4">Home services at your doorstep</h1>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">What are you looking for?</h2>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center p-2 border rounded-lg">
                  <img src={service.icon} alt={service.name} className="h-12 w-12 mr-4" />
                  <span>{service.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-4 grid grid-cols-2 gap-4">
          <img src="/photo/11.webp" alt="Service 1" className="rounded-lg" />
          <img src="/photo/22.webp" alt="Service 2" className="rounded-lg" />
          <img src="/photo/33.webp" alt="Service 3" className="rounded-lg" />
          <img src="/photo/44.webp" alt="Service 4" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default HomeServices;