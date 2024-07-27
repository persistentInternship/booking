import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import clientPromise from '../../../../lib/mongodb';

export async function POST(req: Request) {
  try {
    // Extract email, password, and phone from the request body
    const { email, password, phone } = await req.json();
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert the new user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      phone,
    });

    // Return success response
    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId }, { status: 201 });
  } catch (error) {
    // Log and return error response
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 });
  }
}