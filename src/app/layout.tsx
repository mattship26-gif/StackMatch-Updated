import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToolFinder - Find the Right Tools for Your Situation',
  description: 'Honest, context-aware tool recommendations. No affiliate BS. Just what actually works for your team size, budget, industry, and needs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-slate-900">
                Tool<span className="text-blue-600">Finder</span>
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/categories" className="text-slate-600 hover:text-slate-900">Categories</Link>
                <Link href="/industry" className="text-slate-600 hover:text-slate-900">By Industry</Link>
                <Link href="/stack-builder" className="text-slate-600 hover:text-slate-900">Stack Builder</Link>
                <Link href="/migration" className="text-slate-600 hover:text-slate-900">Should I Switch?</Link>
                <Link href="/tools" className="text-slate-600 hover:text-slate-900">All Tools</Link>
                <Link
                  href="/chat"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  AI Advisor
                </Link>
              </div>
              {/* Mobile */}
              <div className="md:hidden flex gap-3">
                <Link href="/chat" className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium">
                  AI Advisor
                </Link>
                <Link href="/quiz" className="border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm">
                  Quiz
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-slate-900 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-xl font-bold mb-2">Tool<span className="text-blue-400">Finder</span></div>
                <p className="text-slate-400 text-sm">
                  Honest tool recommendations. No affiliate links. No outdated listicles.
                  Just what actually works for your situation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-slate-300">Find Tools</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <Link href="/categories" className="block hover:text-white">Browse Categories</Link>
                  <Link href="/industry" className="block hover:text-white">By Industry</Link>
                  <Link href="/tools" className="block hover:text-white">All Tools</Link>
                  <Link href="/quiz" className="block hover:text-white">Take the Quiz</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-slate-300">Make Decisions</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <Link href="/stack-builder" className="block hover:text-white">Stack Builder</Link>
                  <Link href="/migration" className="block hover:text-white">Should I Switch?</Link>
                  <Link href="/chat" className="block hover:text-white">AI Advisor</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-slate-300">Industries</h4>
                <div className="space-y-2 text-sm text-slate-400">
                  <Link href="/industry/accounting-finance" className="block hover:text-white">Accounting & Finance</Link>
                  <Link href="/industry/legal" className="block hover:text-white">Legal</Link>
                  <Link href="/industry/healthcare" className="block hover:text-white">Healthcare</Link>
                  <Link href="/industry/saas-tech" className="block hover:text-white">SaaS & Tech</Link>
                  <Link href="/industry" className="block hover:text-white text-blue-400">View all →</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-6 text-center text-slate-500 text-sm">
              No affiliate links. No paid placements. Just honest recommendations.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
