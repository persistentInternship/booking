import express from 'express';
import http from 'http';
import next from 'next';
import { MongoClient } from 'mongodb';
import webpush from 'web-push';
import mongoose, { Document, Model } from 'mongoose';

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

// Define the interface for the Style document
interface IStyle extends Document {
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  logoColor?: string;
  hoverColor?: string;
  logoname?: string;
}

// Define the Style schema
const StyleSchema = new mongoose.Schema<IStyle>({
  backgroundColor: String,
  textColor: String,
  buttonColor: String,
  logoColor: String,
  hoverColor: String,
  logoname: String,
}, { timestamps: true });

// Define the Style model with the correct type
let Style: Model<IStyle>;
try {
  Style = mongoose.model<IStyle>('Style');
} catch {
  Style = mongoose.model<IStyle>('Style', StyleSchema);
}

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB via Mongoose');

    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log('Connected to MongoDB via MongoClient');

    return { mongoose, client };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

connectToMongoDB().then(({ mongoose, client }) => {
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
            console.log('Notification sent successfully to:', subscriptionDoc.endpoint);
          } catch (error) {
            if (error instanceof Error && 'statusCode' in error && (error as any).statusCode === 410) {
              console.log('Removing expired subscription:', subscriptionDoc.endpoint);
              await db.collection('pushSubscriptions').deleteOne({ endpoint: subscriptionDoc.endpoint });
            } else {
              console.error('Error sending push notification:', error);
            }
          }
        }
      } else {
        console.error('Updated booking not found');
      }
    }
  });

  nextApp.prepare().then(() => {
    const app = express();
    const server = http.createServer(app);

    app.use(express.json());

    // Your existing Express routes
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

    // Modify the /api/saveStyle route
    app.post('/api/saveStyle', async (req, res) => {
      try {
        const body = req.body;
        console.log('Received body:', body);

        const result = await Style.findOneAndUpdate(
          {}, // Empty filter to match any document
          body, // Update with the new style data
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        );

        // Send push notifications for style update
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
              title: 'Style Update',
              body: 'The website style has been updated.',
              data: result
            }));
          } catch (error) {
            console.error('Error sending push notification:', error);
            // Handle expired subscriptions
            if (error instanceof Error && 'statusCode' in error && (error as any).statusCode === 410) {
              console.log('Removing expired subscription:', subscriptionDoc.endpoint);
              await db.collection('pushSubscriptions').deleteOne({ endpoint: subscriptionDoc.endpoint });
            }
          }
        }

        res.status(200).json({ message: 'Style saved successfully', style: result });
      } catch (error) {
        console.error('Error in POST /api/saveStyle:', error);
        res.status(500).json({ error: 'Error saving style', details: (error as Error).message });
      }
    });

    // Add the GET route to retrieve the current style
    app.get('/api/getStyle', async (req, res) => {
      try {
        const style = await Style.findOne().exec();
        if (style) {
          res.status(200).json(style);
        } else {
          res.status(404).json({ message: 'No style found' });
        }
      } catch (error) {
        console.error('Error in GET /api/getStyle:', error);
        res.status(500).json({ error: 'Error retrieving style', details: (error as Error).message });
      }
    });

    // Handle all other routes with Next.js
    app.all('*', (req, res) => {
      return handle(req, res);
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
}).catch(error => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});