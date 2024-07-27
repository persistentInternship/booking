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

## 🔌 Socket.IO Integration

This project uses Socket.IO for real-time updates. The integration is implemented in two main parts:

1. Server-side (`server.ts`):
   - Sets up an Express server with Socket.IO
   - Connects to MongoDB and watches for changes in the bookings collection
   - Emits 'bookingUpdate' events when changes are detected

2. Client-side (`BookingDetailPage.tsx`):
   - Establishes a Socket.IO connection
   - Listens for 'bookingUpdate' events
   - Updates the UI in real-time when booking data changes

This setup enables instant updates across all connected clients whenever a booking is modified, ensuring a synchronized user experience.

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

Always follow best practices for securing your application and protecting sensitive data.

## 📁 Project Structure
app/
├── api/
├── bookings/
├── services/
├── components/
└── model/
lib/
public/
styles/
.env.local
next.config.js
package.json
README.md
server.ts



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.