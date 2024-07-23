'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

interface Booking {
  _id: string;
  serviceName: string;
  dateTime: string;
  cost: number;
  status: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/bookings');
    } else if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  const fetchBookings = async () => {
    const response = await fetch('/api/bookings');
    if (response.ok) {
      const data = await response.json();
      setBookings(data);
    } else {
      console.error('Failed to fetch bookings');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        {bookings.length === 0 ? (
          <p>You have no bookings.</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
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
        )}
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