'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

// Define Booking interface
interface Booking {
  _id: string;
  serviceName: string;
  dateTime: string;
  cost: number;
  status: string;
}

// Define sorting options
type SortOption = 'dateAsc' | 'dateDesc' | 'costAsc' | 'costDesc';

export default function BookingsPage() {
  // Use Next.js hooks
  const { data: session, status } = useSession();
  const router = useRouter();

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('dateDesc');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/bookings');
    } else if (status === 'authenticated') {
      fetchBookings();
      // Set up Socket.IO connection
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Handle real-time booking updates
      newSocket.on('bookingUpdate', (updatedBooking: Booking | null) => {
        console.log('Received booking update:', updatedBooking);
        if (updatedBooking && updatedBooking._id) {
          setBookings(prevBookings => {
            const updatedBookings = prevBookings.map(booking => 
              booking._id === updatedBooking._id ? updatedBooking : booking
            );
            console.log('Updated bookings:', updatedBookings);
            return updatedBookings;
          });
        } else {
          console.error('Received invalid booking update:', updatedBooking);
        }
      });

      // Clean up Socket.IO connection
      return () => {
        console.log('Disconnecting socket');
        newSocket.disconnect();
      };
    }
  }, [status, router]);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data: Booking[] = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sort bookings based on selected option
  const sortBookings = (option: SortOption) => {
    setSortOption(option);
    const sortedBookings = [...bookings].sort((a, b) => {
      switch (option) {
        case 'dateAsc':
          return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
        case 'dateDesc':
          return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
        case 'costAsc':
          return a.cost - b.cost;
        case 'costDesc':
          return b.cost - a.cost;
        default:
          return 0;
      }
    });
    setBookings(sortedBookings);
  };

  // Calculate pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render loading state
  if (status === 'loading' || isLoading) {
    return (
      <>
        <NavBar />
        <Loading />
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

  // Render bookings list
  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <select
            className="border rounded px-2 py-1"
            value={sortOption}
            onChange={(e) => sortBookings(e.target.value as SortOption)}
          >
            <option value="dateDesc">Date (Newest First)</option>
            <option value="dateAsc">Date (Oldest First)</option>
            <option value="costDesc">Cost (Highest First)</option>
            <option value="costAsc">Cost (Lowest First)</option>
          </select>
        </div>
        {bookings.length === 0 ? (
          <p>You have no bookings.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {currentBookings.map((booking) => (
                <li key={booking._id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Link href={`/bookings/${booking._id}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
                        <p className="text-sm text-gray-600">Date: {new Date(booking.dateTime).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Cost: ${booking.cost.toFixed(2)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstBooking + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastBooking, bookings.length)}</span> of{' '}
                    <span className="font-medium">{bookings.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          number === currentPage
                            ? 'z-10 bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only ">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
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
    default: return 'bg-gray-200 text-gray-800';
  }
}