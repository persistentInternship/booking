"use client" // Indicates that this is a Client Component in Next.js

import { SessionProvider } from "next-auth/react"

// Providers component that wraps the application with SessionProvider
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}