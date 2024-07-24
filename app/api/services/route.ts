import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Service } from '@/app/model/Service';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const body: Service = await request.json();
    const result = await db.collection('services').insertOne(body);
    return NextResponse.json({ message: 'Service added successfully', id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding service' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  try {
    const client = await clientPromise;
    const db = client.db();
    const servicesCollection = db.collection('services');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    const services = await servicesCollection.find(query).toArray();

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}