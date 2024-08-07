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
            if (data.title === 'Booking Update') {
              return client.postMessage({
                type: 'BOOKING_UPDATE',
                booking: data.data
              });
            } else if (data.title === 'Style Update') {
              return client.postMessage({
                type: 'STYLE_UPDATE',
                styles: data.data
              });
            }
          });
        });
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked');
  event.notification.close();
  
  if (event.notification.title === 'Booking Update') {
    event.waitUntil(clients.openWindow('/bookings'));
  } else if (event.notification.title === 'Style Update') {
    // For style updates, we don't need to open a new window
    // The styles will be updated in the existing windows
    console.log('Style update notification clicked');
  }
});