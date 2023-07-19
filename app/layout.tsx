import './globals.css';
import type { Metadata } from 'next';
import { Inter, Urbanist } from 'next/font/google';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shopify App',
  description: 'Shopify App'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={font.className}>{children}</body>
    </html>
  );
}
