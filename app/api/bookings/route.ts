import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST request handler for creating a new booking
export async function POST(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Extract booking data from request body
    const body = await request.json();
    
    // Prepare booking object
    const booking = {
      ...body,
      userId: session.user.email,
      createdAt: new Date(),
    };
    
    // Insert the new booking
    const result = await db.collection('bookings').insertOne(booking);
    
    return NextResponse.json({ message: 'Booking added successfully', id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding booking' }, { status: 500 });
  }
}

// GET request handler for fetching user's bookings
export async function GET(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch bookings for the authenticated user
    const bookings = await db.collection('bookings')
      .find({ userId: session.user.email })
      .project({
        serviceName: 1,
        dateTime: 1,
        cost: 1,
        status: 1
      })
      .toArray();
    
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
  }
}