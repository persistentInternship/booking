import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const defaultStyles = {
  backgroundColor: 'bg-gray-950',
  textColor: 'text-white',
  buttonColor: 'bg-black',
  logoColor: 'bg-white',
  hoverColor: 'hover:bg-gray-800'
};

export async function getStyles() {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const stylesCollection = db.collection("style");
    
    const styles = await stylesCollection.findOne({});

    if (!styles) {
      console.log('No styles found in database, using default styles');
      return defaultStyles;
    }

    // Remove the _id field from the response
    const { _id, ...stylesWithoutId } = styles;

    // Merge with default styles to ensure all properties are present
    return { ...defaultStyles, ...stylesWithoutId };
  } catch (error) {
    console.error('Error fetching styles:', error);
    return defaultStyles;
  }
}

export async function GET() {
  const styles = await getStyles();
  return NextResponse.json(styles);
}