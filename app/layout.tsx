import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MIGSTART AI - Multilingual Form Assistant',
  description: 'Fill out German government forms easily in your own language with AI assistance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}