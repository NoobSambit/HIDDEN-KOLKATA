import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hidden Kolkata - Discover Hidden Gems',
  description: 'Discover and share hidden spots across Kolkata - old cafes, bookstores, ghats, and vintage corners',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
