import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { MongoClient, ChangeStream } from 'mongodb';
import next from 'next';

// Determine if we're in development mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDB connection string and database name
const mongoUrl = 'mongodb+srv://sctaman21:waitforit@test.vg3iafi.mongodb.net/?retryWrites=true&w=majority&appName=test';
const dbName = 'test';

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  MongoClient.connect(mongoUrl)
    .then((client: MongoClient) => {
      console.log('Connected to MongoDB');
      const db = client.db(dbName);
      const bookingsCollection = db.collection('bookings');

      // Set up a change stream to watch for updates in the bookings collection
      const changeStream: ChangeStream = bookingsCollection.watch([], { fullDocument: 'updateLookup' });

      changeStream.on('change', (change: any) => {
        console.log('Change detected:', change);
        if (change.operationType === 'update' && change.fullDocument) {
          const updatedBooking = change.fullDocument;
          console.log('Emitting bookingUpdate:', updatedBooking);
          // Emit the updated booking to all connected clients
          io.emit('bookingUpdate', updatedBooking);
        } else {
          console.error('Received invalid change event:', change);
        }
      });

      // Handle Socket.IO connections
      io.on('connection', (socket) => {
        console.log('New client connected');
        socket.on('disconnect', () => {
          console.log('Client disconnected');
        });
      });

      // Handle all requests with Next.js
      server.all('*', (req: Request, res: Response) => {
        return handle(req, res);
      });

      // Start the server
      httpServer.listen(3000, (err?: Error) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
      });
    })
    .catch((error: Error) => console.error('Failed to connect to MongoDB', error));
});