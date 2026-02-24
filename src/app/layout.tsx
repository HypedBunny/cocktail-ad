import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cocktails From Around the World | Discover Global Cocktail Recipes',
  description:
    'Explore 400+ cocktail recipes from every region of the world. Filter by spirit, taste, and preparation method. From classic European martinis to Caribbean rum punches.',
  keywords: 'cocktails, cocktail recipes, drinks, spirits, gin, rum, vodka, whiskey, tequila, mixology',
  openGraph: {
    title: 'Cocktails From Around the World',
    description: 'Discover cocktail recipes from every corner of the globe.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8366980911492709"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
