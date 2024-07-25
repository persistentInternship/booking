import React from 'react';

const ServiceImages = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <img src="/photo/fixing.jpg" alt="Plumbing Service" className="rounded-lg w-full h-[200px] object-cover" />
      <img src="/photo/massage.jpg" alt="Massage Service" className="rounded-lg w-full h-[200px] object-cover" />
      <img src="/photo/Repair.webp" alt="Electronics Repair" className="rounded-lg w-full h-[200px] object-cover" />
      <img src="/photo/ac.jpg" alt="AC Repair Service" className="rounded-lg w-full h-[200px] object-cover" />
    </div>
  );
};

export default ServiceImages;