# Booking Management System

## 📝 Description

This project is a comprehensive booking management system built with Next.js, React, and Socket.IO. It provides functionality for users to view, create, edit, and cancel bookings, with real-time updates across all connected clients.

## ✨ Features

- User authentication
- Booking creation and management
- Service listing and management
- Real-time updates using Socket.IO
- Responsive design with Tailwind CSS

## 🚀 Main Components

1. `BookingsPage`: Displays a list of user bookings with sorting options.
2. `BookingDetailPage`: Shows detailed information for a single booking, with options to edit and cancel.
3. `ServicesPage`: Displays a list of available services with search and filter functionality.
4. `ServiceDetailPage`: Shows detailed information for a single service, allowing users to book the service.
5. `NavBar`: Navigation component for the application.
6. `Footer`: Footer component for the application.
7. `Loading`: Loading indicator component.

## 🛣️ API Routes

- `/api/auth/[...nextauth]`: Handles authentication using NextAuth.js.
- `/api/auth/signup`: Handles user registration.
- `/api/bookings`: Handles fetching and creating bookings.
- `/api/bookings/[id]`: Handles fetching, updating, and cancelling individual bookings.
- `/api/services`: Handles fetching and creating services.

## Push Notification System

Our project implements a real-time push notification system to keep users informed about style updates across the application. This system ensures that all connected clients receive instant updates when global styles are changed.

### Key Components

1. **Server-Side Setup**
   The server uses the `web-push` library to handle push notifications:

   ```typescript
   const webpush = require('web-push');

   const vapidDetails = {
     subject: 'mailto:your-email@example.com',
     publicKey: 'YOUR_PUBLIC_VAPID_KEY',
     privateKey: 'YOUR_PRIVATE_VAPID_KEY'
   };

   webpush.setVapidDetails(
     vapidDetails.subject,
     vapidDetails.publicKey,
     vapidDetails.privateKey
   );
   ```

2. **Client-Side Subscription**
   When a user visits the site, their browser subscribes to push notifications:

   ``` typescript
   if ('serviceWorker' in navigator && 'PushManager' in window) {
     const registration = await navigator.serviceWorker.register('/service-worker.js');
     const subscription = await registration.pushManager.subscribe({
       userVisibleOnly: true,
       applicationServerKey: vapidPublicKey
     });
     
     await fetch('/api/subscribe', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(subscription)
     });
   }
   ```

3. **Sending Notifications**
   When styles are updated, the server sends notifications to all subscribed clients:

   ```typescript
   const subscriptions = await db.collection('pushSubscriptions').find({}).toArray();
   for (const subscription of subscriptions) {
     try {
       await webpush.sendNotification(subscription, JSON.stringify({
         title: 'Style Update',
         body: 'The website style has been updated.',
         data: updatedStyles
       }));
     } catch (error) {
       console.error('Error sending push notification:', error);
     }
   }
   ```

4. **Service Worker**
   The service worker (`public/service-worker.js`) handles incoming push events:

   ```typescript
   self.addEventListener('push', function(event) {
     const data = event.data.json();
     self.registration.showNotification(data.title, {
       body: data.body,
       data: data.data
     });
   });
   ```

5. **Client-Side Handling**
   The main application listens for messages from the service worker:

   ```typescript
   navigator.serviceWorker.addEventListener('message', (event) => {
     if (event.data && event.data.type === 'STYLE_UPDATE') {
       updateStyles(event.data.styles);
     }
   });
   ```

### How It Works

1. Users subscribe to push notifications on their first visit.
2. When styles are updated (e.g., in the settings page), the server saves the new styles and sends push notifications to all subscribed clients.
3. The service worker receives the push event, shows a notification, and sends a message to the client.
4. The client receives the message and updates the styles in real-time.

This system enables instant style updates across all connected clients without requiring a page refresh, enhancing the user experience with real-time synchronization.


## 🏁 Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see below)
4. Run the development server with `npm run dev`

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

These environment variables are used as follows:

- `MONGODB_URI`: This is your MongoDB connection string. It's used to connect to your database.
- `NEXTAUTH_SECRET`: This is a secret key used by NextAuth.js for encryption. Make sure to keep this secret and don't share it publicly.


To use these environment variables in your code, replace hardcoded values with `process.env.VARIABLE_NAME`. For example:

const mongoUrl = process.env.MONGODB_URI || '';


## 🔒 Security Note

The MongoDB connection string and NextAuth secret in this example are placeholders. In a real-world application, you should:

1. Use a more secure password for your MongoDB user.
2. Generate a strong, random string for your NextAuth secret.
3. Consider using separate databases for development and production environments.
4. Ensure that your MongoDB cluster has appropriate security measures in place, such as IP whitelisting and proper user permissions.


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
