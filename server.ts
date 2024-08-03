import express from 'express';
import http from 'http';
import next from 'next';
import { MongoClient } from 'mongodb';
import webpush from 'web-push';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const mongoUrl = process.env.MONGODB_URI || 'mongodb+srv://sctaman21:waitforit@test.vg3iafi.mongodb.net/?retryWrites=true&w=majority&appName=test';
const dbName = 'test';

// Set VAPID details directly
const vapidDetails = {
  subject: 'mailto:sctaman21@gmail.com',
  publicKey: 'BO2Jsb7LMLoPquHZEFKWBkndxtbJ8q8qW-RE2vn5lWoeUlYWgRNPb81xc14TXIkTOL7tC7qB25UxIlk2byqAU_c',
  privateKey: 'j-LBWiVoBITk8wJ1rXYI_T4krYvrM4lH4DA4nwtUsek'
};

webpush.setVapidDetails(
  vapidDetails.subject,
  vapidDetails.publicKey,
  vapidDetails.privateKey
);

nextApp.prepare().then(async () => {
  const app = express();
  const server = http.createServer(app);

  const client = new MongoClient(mongoUrl);
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db(dbName);
  const bookingsCollection = db.collection('bookings');
  const changeStream = bookingsCollection.watch();

  changeStream.on('change', async (change) => {
    if (change.operationType === 'update') {
      const updatedBooking = await bookingsCollection.findOne({ _id: change.documentKey._id });

      if (updatedBooking) {
        const subscriptions = await db.collection('pushSubscriptions').find({}).toArray();
        for (const subscriptionDoc of subscriptions) {
          try {
            const subscription = {
              endpoint: subscriptionDoc.endpoint,
              keys: {
                p256dh: subscriptionDoc.keys.p256dh,
                auth: subscriptionDoc.keys.auth
              }
            };

            await webpush.sendNotification(subscription, JSON.stringify({
              title: 'Booking Update',
              body: `Booking status changed to ${updatedBooking.status}`,
              data: updatedBooking
            }));
          } catch (error) {
            console.error('Error sending push notification:', error);
            if (error instanceof Error && 'statusCode' in error && (error as any).statusCode === 410) {
              console.log('Removing expired subscription:', subscriptionDoc.endpoint);
              await db.collection('pushSubscriptions').deleteOne({ endpoint: subscriptionDoc.endpoint });
            }
          }
        }
      } else {
        console.error('Updated booking not found');
      }
    }
  });

  app.use(express.json());

  app.get('/api/vapidPublicKey', (req, res) => {
    res.json({ publicKey: vapidDetails.publicKey });
  });

  app.post('/api/subscribe', async (req, res) => {
    const subscription = req.body;
    await db.collection('pushSubscriptions').insertOne(subscription);
    res.status(201).json({});
  });

  app.get('/api/bookings', async (req, res) => {
    const bookings = await bookingsCollection.find({}).toArray();
    res.json(bookings);
  });

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});