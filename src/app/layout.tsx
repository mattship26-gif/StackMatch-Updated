import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToolFinder - Find the Right Tools for Your Situation',
  description: 'Honest, context-aware tool recommendations. No affiliate BS. Just what actually works for your team size, budget, and needs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Simple Header */}
        <header className="border-b border-slate-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-slate-900">
                Tool<span className="text-blue-600">Finder</span>
              </Link>
              <div className="flex gap-6">
                <Link href="/categories" className="text-slate-600 hover:text-slate-900">
                  Categories
                </Link>
                <Link href="/tools" className="text-slate-600 hover:text-slate-900">
                  All Tools
                </Link>
                <Link href="/quiz" className="text-blue-600 hover:text-blue-700 font-medium">
                  Get Recommendations
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Simple Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-slate-600">
              <p className="mb-2">
                <span className="font-bold">ToolFinder</span> - Honest tool recommendations for everyone
              </p>
              <p className="text-sm">
                No affiliate links. No BS. Just what works.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
