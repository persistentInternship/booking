const webpush = require('web-push');
const fs = require('fs');

const vapidKeys = webpush.generateVAPIDKeys();

const envContent = `
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
VAPID_SUBJECT=mailto:your-email@example.com
`;

fs.writeFileSync('.env.local', envContent, { flag: 'a' });

console.log('VAPID keys generated and added to .env.local');
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);