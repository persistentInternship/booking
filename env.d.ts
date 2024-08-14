declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI?: string;
    NEXTAUTH_SECRET?: string;
    NEXT_PUBLIC_VAPID_PUBLIC_KEY?: string;
    VAPID_PRIVATE_KEY?: string;
    VAPID_SUBJECT?: string;
  }
}