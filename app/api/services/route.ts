import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Service, ServiceInput } from '@/app/interface/model/Service';

// POST request handler for adding a new service
export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Extract service data from request body
    const body: ServiceInput = await request.json();
    
    // Insert the new service
    const result = await db.collection<Service>('services').insertOne(body);
    
    return NextResponse.json({ message: 'Service added successfully', id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding service' }, { status: 500 });
  }
}

// GET request handler for fetching services
export async function GET(request: Request) {
  // Extract query parameters
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const servicesCollection = db.collection('services');

    // Prepare query
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

    // Fetch services based on the query
    const services = await servicesCollection.find(query).toArray();

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}