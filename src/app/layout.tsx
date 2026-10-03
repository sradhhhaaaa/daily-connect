import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'Daily Connect | Verified Local Skilled Workers & Home Services',
  description: 'Connect directly with background-verified local electricians, plumbers, painters, and carpenters in your neighborhood. Instant chat, transparent pricing, and two-way ratings.',
  keywords: ['electrician', 'plumber', 'painter', 'carpenter', 'home repair', 'verified skilled workers', 'local services'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#2A2A2A] antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
