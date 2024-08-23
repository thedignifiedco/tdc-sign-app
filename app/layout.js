import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Adobe Sign App',
  description: 'Demo app for Adobe Sign API integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
