import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Little Voice Studio",
  description: "Educational frames & custom uploads — Little Voice Studio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Little Voice Studio
            </Link>
            <nav className="flex gap-6 text-gray-600">
              <Link href="/shop" className="hover:text-primary">
                Shop
              </Link>
              <Link href="/admin" className="hover:text-primary">
                Admin
              </Link>
              <Link href="/cart" className="hover:text-primary">
                Cart
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">{children}</main>
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Little Voice Studio · All rights reserved
          </div>
        </footer>
      </body>
    </html>
  );
}
