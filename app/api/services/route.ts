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

  try {
    const client = await clientPromise;
    const db = client.db();
    let query = {};
    if (category) {
      query = { category };
    }
    const services = await db.collection('services').find(query).toArray();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });
  }
}