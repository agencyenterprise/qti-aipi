import React from 'react';
import './globals.css';
import '../styles/qti-interactions.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QTI Editor',
  description: 'Question & Test Interoperability (QTI) Editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">QTI Editor</h1>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
