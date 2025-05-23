"use client"; // This file is now a Client Component

import GlobalState from '@/context';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '../components/Footer/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalState>
          <Navbar />
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1080280280607971"
            crossOrigin="anonymous"
          ></script>
          <main className="flex min-h-screen flex-col mt-[0px]">
            {children}
            <Analytics />
            <SpeedInsights />
          </main>
          <Footer />
        </GlobalState>
      </body>
    </html>
  );
}
