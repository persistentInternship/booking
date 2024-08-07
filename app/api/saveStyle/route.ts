import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

interface IStyle {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  logoColor: string;
  hoverColor: string;
  logoname: string;
  userId: string;
}

const StyleSchema = new mongoose.Schema<IStyle>({
  backgroundColor: String,
  textColor: String,
  buttonColor: String,
  logoColor: String,
  hoverColor: String,
  logoname: String,
  userId: { type: String, unique: true },
});

let Style: mongoose.Model<IStyle>;

try {
  Style = mongoose.model<IStyle>('Style');
} catch {
  Style = mongoose.model<IStyle>('Style', StyleSchema);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Not authenticated or user ID not available' }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const body = await req.json();
    console.log('Received body:', body);

    // Add the userId to the style data
    const styleData = { ...body, userId: session.user.id };

    // Try to find an existing style for the user
    let existingStyle = await Style.findOne({ userId: session.user.id });

    if (existingStyle) {
      // Update existing style
      Object.assign(existingStyle, styleData);
      await existingStyle.save();
      return NextResponse.json({ message: 'Style updated successfully' }, { status: 200 });
    } else {
      // Create new style
      const newStyle = new Style(styleData);
      await newStyle.save();
      return NextResponse.json({ message: 'Style created successfully' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error in POST /api/saveStyle:', error);
    return NextResponse.json({ error: 'Error saving style', details: (error as Error).message }, { status: 500 });
  }
}