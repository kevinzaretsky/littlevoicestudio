import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Little Voice Studio',
  description: 'Custom educational frames and uploads — Little Voice Studio',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-700 hover:text-blue-800">
              Little Voice Studio
            </Link>
            <nav className="flex gap-6 text-gray-600">
              <Link href="/shop" className="hover:text-blue-700">
                Shop
              </Link>
              <Link href="/admin" className="hover:text-blue-700">
                Admin
              </Link>
              <Link href="/cart" className="hover:text-blue-700">
                Cart
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-10">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Little Voice Studio · All rights reserved
          </div>
        </footer>
      </body>
    </html>
  );
}
