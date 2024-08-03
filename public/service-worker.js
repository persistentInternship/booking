self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log('Push received:', data);

  const options = {
    body: data.body,
    data: data.data
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => {
        // Notify the client about the update
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          return clients.map(client => {
            return client.postMessage({
              type: 'BOOKING_UPDATE',
              booking: data.data
            });
          });
        });
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/bookings')
  );
});