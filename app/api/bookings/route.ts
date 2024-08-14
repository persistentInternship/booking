import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    console.log('POST /api/bookings: Start');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session || !session.user) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received booking data:', body);
    
    const db = await getDatabase('your_database_name');
    console.log('Connected to database');
    
    const booking = {
      ...body,
      userId: session.user.email,
      createdAt: new Date(),
    };
    
    const result = await db.collection('bookings').insertOne(booking);
    console.log('Booking inserted:', result);
    
    console.log('POST /api/bookings: End');
    return NextResponse.json({ message: 'Booking added successfully', id: result.insertedId });
  } catch (error) {
    console.error('Detailed error in POST /api/bookings:', error);
    return NextResponse.json({ error: 'Error adding booking', details: (error as Error).message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const db = await getDatabase('your_database_name');
    
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
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Error fetching bookings', details: (error as Error).message }, { status: 500 });
  }
}