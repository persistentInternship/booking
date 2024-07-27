'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import io from 'socket.io-client';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';

// Define Booking interface
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
  // State management
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState<Partial<Booking>>({});
  const router = useRouter();

  useEffect(() => {
    // Fetch booking details
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

    // Set up Socket.IO connection
    const socket = io();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Handle real-time booking updates
    socket.on('bookingUpdate', (updatedBooking: Booking) => {
      console.log('Received booking update:', updatedBooking);
      if (updatedBooking._id === params.id) {
        setBooking(updatedBooking);
      }
    });

    // Clean up Socket.IO connection
    return () => {
      console.log('Disconnecting socket');
      socket.disconnect();
    };
  }, [params.id]);

  // Handle booking cancellation
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

  // Switch to edit mode
  const handleEdit = () => {
    setIsEditing(true);
    setEditedBooking({
      name: booking?.name,
      email: booking?.email,
      dateTime: booking?.dateTime,
    });
  };

  // Save edited booking
  const handleSave = async () => {
    if (!booking) return;

    try {
      const response = await fetch(`/api/bookings/${booking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedBooking),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking');
      }

      const updatedBooking = await response.json();
      setBooking(updatedBooking);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking. Please try again.');
    }
  };

  // Handle input changes in edit mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedBooking(prev => ({ ...prev, [name]: value }));
  };

  // Render loading state
  if (isLoading) {
    return (
      <>
        <NavBar />
        <Loading/>
        <Footer />
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto mt-8 px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Handle case when booking is not found
  if (!booking) {
    notFound();
  }

  // Render booking details
  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-8 px-4">
        <Link href="/bookings" className="text-black hover:underline mb-4 inline-block">&larr; Back to Bookings</Link>
        <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Booking ID: {booking._id}</p>
          <h2 className="text-2xl font-semibold mb-4">{booking.serviceName}</h2>
          
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editedBooking.name || ''}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="email"
                name="email"
                value={editedBooking.email || ''}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded w-full"
              />
              <input
                type="datetime-local"
                name="dateTime"
                value={editedBooking.dateTime ? new Date(editedBooking.dateTime).toISOString().slice(0, 16) : ''}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded w-full"
              />
            </>
          ) : (
            <>
              <p className="mb-2">Date: {new Date(booking.dateTime).toLocaleString()}</p>
              <p className="mb-2">Cost: ${booking.cost.toFixed(2)}</p>
              <p className="mb-4">Status: <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>{booking.status}</span></p>
              
              <h3 className="text-xl font-semibold mt-6 mb-2">Customer Information</h3>
              <p className="mb-1">Name: {booking.name}</p>
              <p className="mb-4">Email: {booking.email}</p>
            </>
          )}
          
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded mr-2"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-black text-white px-4 py-2 rounded mr-2"
            >
              Edit Booking
            </button>
          )}
          
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

// Helper function to get status color
function getStatusColor(status: string): string {
  switch (status) {
    case 'Pending': return 'bg-yellow-200 text-yellow-800';
    case 'Confirmed': return 'bg-green-200 text-green-800';
    case 'Cancelled': return 'bg-red-200 text-red-800';
    default: return '';
  }
}