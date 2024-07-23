'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';
import io from 'socket.io-client';

interface Booking {
  _id: string;
  serviceName: string;
  dateTime: string;
  cost: number;
  status: string;
  name: string;
  email: string;
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const socket = io();

    socket.on('bookingUpdated', (updatedBooking: Booking) => {
      if (updatedBooking._id === params.id) {
        console.log('Received real-time update for booking:', updatedBooking);
        setBooking(updatedBooking);
      }
    });

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }
        const data = await response.json();
        console.log('Fetched booking data:', data);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError('Failed to fetch booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();

    return () => {
      socket.disconnect();
    };
  }, [params.id]);

  const handleCancel = async () => {
    if (!booking) return;

    try {
      console.log('Attempting to cancel booking:', booking._id);
      const response = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      const updatedBooking = await response.json();
      console.log('Booking cancelled successfully:', updatedBooking);
      setBooking(updatedBooking);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!booking) {
    notFound();
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-8 px-4">
        <Link href="/bookings" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Bookings</Link>
        <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Booking ID: {booking._id}</p>
          <h2 className="text-2xl font-semibold mb-4">{booking.serviceName}</h2>
          <p className="mb-2">Date: {new Date(booking.dateTime).toLocaleString()}</p>
          <p className="mb-2">Cost: ${booking.cost.toFixed(2)}</p>
          <p className="mb-4">Status: <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>{booking.status}</span></p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Customer Information</h3>
          <p className="mb-1">Name: {booking.name}</p>
          <p className="mb-4">Email: {booking.email}</p>
          
          {booking.status !== 'Cancelled' && (
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending': return 'bg-yellow-200 text-yellow-800';
    case 'Confirmed': return 'bg-green-200 text-green-800';
    case 'Cancelled': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-200 text-gray-800';
  }
}