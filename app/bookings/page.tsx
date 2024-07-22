import Link from 'next/link';
import bookings from './booking.json';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function BookingsPage() {
  return (
    <>
    <NavBar />
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li key={booking.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Link href={`/bookings/${booking.id}`} className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
                <p className="text-sm text-gray-600">Date: {new Date(booking.dateTime).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Cost: ${booking.cost.toFixed(2)}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    <Footer/>
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