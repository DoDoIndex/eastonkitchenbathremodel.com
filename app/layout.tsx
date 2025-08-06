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
  title: "Caden Tile - Premium Tiles & Home Improvement",
  description: "Your one-stop shop for premium tiles and home improvement products.",
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
