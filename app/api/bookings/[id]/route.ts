import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET request handler
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Connect to MongoDB and fetch the booking
    const client = await clientPromise;
    const db = client.db();
    const booking = await db.collection('bookings').findOne({
      _id: new ObjectId(params.id),
      userId: session.user.email
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Error fetching booking' }, { status: 500 });
  }
}

// PATCH request handler
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Extract update data from request body
    const { status, name, email, dateTime } = await request.json();

    // Prepare update data
    const updateData: { [key: string]: any } = {};
    if (status === 'Cancelled') {
      updateData.status = 'Cancelled';
    }
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (dateTime) updateData.dateTime = new Date(dateTime);

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid update data provided' }, { status: 400 });
    }

    // Update the booking
    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(params.id), userId: session.user.email },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Error updating booking' }, { status: 500 });
  }
}