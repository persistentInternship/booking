import { notFound } from 'next/navigation';
import Link from 'next/link';
import bookings from '../booking.json';
import CancelButton from '../../components/CancelButton';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const bookingId = parseInt(params.id, 10);
  const booking = bookings.find(b => b.id === bookingId);

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
        <p className="text-sm text-gray-600 mb-2">Booking ID: {booking.id}</p>
        <h2 className="text-2xl font-semibold mb-4">{booking.serviceName}</h2>
        <p className="mb-2">Date: {new Date(booking.dateTime).toLocaleString()}</p>
        <p className="mb-2">Cost: ${booking.cost.toFixed(2)}</p>
        <p className="mb-4">Status: <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>{booking.status}</span></p>
        
        <h3 className="text-xl font-semibold mt-6 mb-2">Customer Information</h3>
        <p className="mb-1">Name: {booking.customer.name}</p>
        <p className="mb-1">Phone: {booking.customer.phone}</p>
        <p className="mb-4">Email: {booking.customer.email}</p>
        
        {booking.status !== 'Cancelled' && <CancelButton bookingId={booking.id} />}
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