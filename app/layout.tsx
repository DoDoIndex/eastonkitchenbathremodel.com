import type { Metadata } from "next";
import { Noto_Serif, Noto_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Anaheim Hills Contractor - Kitchen & Bathroom Remodeling | Travis Easton - Licensed CSLB 1121194',
  description: 'Expert kitchen and bathroom remodeling in Anaheim Hills & Orange County. Licensed contractor Travis delivers stunning transformations with 20+ years experience. Real photos, quality craftsmanship. Call (657) 888-0026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${geistMono.variable} ${notoSerif.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
