import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import webpush from 'web-push';

// Set up web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const client = await clientPromise;
    const db = client.db("your_database_name");
    const stylesCollection = db.collection("styles");
    
    await stylesCollection.updateOne({}, { $set: body }, { upsert: true });

    // Send push notification to all subscribed clients
    const subscriptions = await db.collection("push_subscriptions").find({}).toArray();
    
    const notificationPayload = JSON.stringify({
      title: 'Style Update',
      body: 'The application styles have been updated.',
      data: body
    });

    const notificationPromises = subscriptions.map(subscriptionDoc => {
      const subscription = {
        endpoint: subscriptionDoc.endpoint,
        keys: {
          p256dh: subscriptionDoc.keys.p256dh,
          auth: subscriptionDoc.keys.auth
        }
      };
      return webpush.sendNotification(subscription, notificationPayload);
    });

    await Promise.all(notificationPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving style:', error);
    return NextResponse.json({ success: false, error: 'Failed to save style' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("your_database_name");
    const stylesCollection = db.collection("styles");
    
    const styles = await stylesCollection.findOne({});

    if (!styles) {
      console.log('No styles found in database, using default styles');
      return NextResponse.json({ success: false, error: 'No styles found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, styles });
  } catch (error) {
    console.error('Error fetching styles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch styles' }, { status: 500 });
  }
}