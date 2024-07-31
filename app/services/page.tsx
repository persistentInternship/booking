'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { useStyles } from '../contexts/StyleContext';

interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  photo: string;
  rating: number;
  description: string;
}

interface BookingFormData {
  name: string;
  email: string;
  date: string;
  time: string;
}

const ServicesPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams?.get('category') ?? null;
  const searchQuery = searchParams?.get('search') ?? null;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingFormData, setBookingFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    date: '',
    time: '',
  });
  const [noResults, setNoResults] = useState(false);
  const { styles } = useStyles();

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setNoResults(false);
      let url = '/api/services';
      const params = new URLSearchParams();

      if (category) {
        params.append('category', category);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setServices(data);
          setNoResults(data.length === 0);
        } else {
          console.error('Failed to fetch services');
          setServices([]);
          setNoResults(true);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
        setNoResults(true);
      }
      setLoading(false);
    };

    fetchServices();
  }, [category, searchQuery]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleBooking = () => {
    if (status === 'authenticated') {
      setShowBookingForm(true);
    } else {
      router.push('/login'); // Redirect to login page if not authenticated
    }
  };

  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const booking = {
      ...bookingFormData,
      serviceId: selectedService._id,
      serviceName: selectedService.name,
      cost: selectedService.price,
      status: 'Pending',
      dateTime: new Date(`${bookingFormData.date}T${bookingFormData.time}`).toISOString(),
    };

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });

    if (response.ok) {
      console.log('Booking submitted:', booking);
      setBookingFormData({ name: '', email: '', date: '', time: '' });
      setShowBookingForm(false);
      setSelectedService(null);
      router.push('/bookings');
    } else {
      console.error('Failed to submit booking');
    }
  };

  const resetBookingForm = () => {
    setBookingFormData({
      name: '',
      email: '',
      date: '',
      time: '',
    });
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          {searchQuery
            ? `Search Results for: ${searchQuery}`
            : category
            ? `Services: ${category}`
            : 'All Services'}
        </h1>
        {loading ? (
          <Loading />
        ) : noResults ? (
          <p className="text-center text-gray-600">No services found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <img src={service.photo} alt={service.name} className="w-full h-48 object-cover mb-2 rounded" />
                <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                <p className="text-gray-600">Price: ${service.price}</p>
                <p className="text-gray-600">Rating: {service.rating.toFixed(1)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedService.name}</h2>
            <img src={selectedService.photo} alt={selectedService.name} className="w-full h-64 object-cover mb-4 rounded" />
            <p className="text-gray-600 mb-2">Category: {selectedService.category}</p>
            <p className="text-gray-600 mb-2">Price: ${selectedService.price}</p>
            <p className="text-gray-600 mb-2">Duration: {selectedService.duration}</p>
            <p className="text-gray-600 mb-2">Rating: {selectedService.rating.toFixed(1)}</p>
            <p className="text-gray-800 mb-4">{selectedService.description}</p>
            <div className="flex justify-end space-x-4">
              <button
                className={`${styles.buttonColor} ${styles.textColor} px-4 py-2 rounded`}
                onClick={handleBooking}
              >
                Book
              </button>
              <button
                className={`${styles.backgroundColor} ${styles.textColor} px-4 py-2 rounded`}
                onClick={() => setSelectedService(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Book Service</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={bookingFormData.name}
                  onChange={handleBookingFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bookingFormData.email}
                  onChange={handleBookingFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-gray-700 font-bold mb-2">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingFormData.date}
                  onChange={handleBookingFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="time" className="block text-gray-700 font-bold mb-2">Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={bookingFormData.time}
                  onChange={handleBookingFormChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className={`${styles.buttonColor} ${styles.textColor} px-4 py-2 rounded`}
                >
                  Submit Booking
                </button>
                <button
                  type="button"
                  className={`${styles.backgroundColor} ${styles.textColor} px-4 py-2 rounded`}
                  onClick={resetBookingForm}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className={`${styles.backgroundColor} ${styles.textColor} px-4 py-2 rounded`}
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ServicesPage;