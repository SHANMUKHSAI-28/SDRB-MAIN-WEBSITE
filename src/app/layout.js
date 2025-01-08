import GlobalState from '@/context';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '../components/Footer/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SDRB TECHNOLOGIES | Best Home Automations Company',
  description: 'Your Tech, Upgraded',
};

export default function RootLayout({ children }) {
  useEffect(() => {
    // Dynamically load Razorpay script
    const razorpayScript = document.createElement('script');
    razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
    razorpayScript.async = true;
    razorpayScript.onload = () => console.log('Razorpay script loaded successfully');
    razorpayScript.onerror = () => console.error('Failed to load Razorpay script');
    document.body.appendChild(razorpayScript);
  }, []);

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
