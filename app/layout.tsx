import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from 'react';
import "./globals.css";
import { Providers } from "../app/components/Providers";
import ClientSessionProvider from "./ClientSessionProvider";
import LoadingPage from './loading';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booking",
  description: "Booking services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientSessionProvider>
          <Providers>
            <Suspense fallback={<LoadingPage />}>
              {children}
            </Suspense>
          </Providers>
        </ClientSessionProvider>
      </body>
    </html>
  );
}