import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const body = await request.json();
    const booking = {
      ...body,
      userId: session.user.email, // Changed from session.user.id to session.user.email
      createdAt: new Date(),
    };
    const result = await db.collection('bookings').insertOne(booking);
    return NextResponse.json({ message: 'Booking added successfully', id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding booking' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
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