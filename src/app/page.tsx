'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { qtiService } from '../services/qtiService';
import Link from 'next/link';

interface QTIItem {
  identifier: string;
  title: string;
  content: any;
}

interface PaginationData {
  items: QTIItem[];
  total: number;
  page: number;
  pages: number;
}

export default function Home() {
  const [paginationData, setPaginationData] = useState<PaginationData>({
    items: [],
    total: 0,
    page: 1,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchItems = async (page: number) => {
    try {
      setLoading(true);
      const data = await qtiService.getAllItems(page, itemsPerPage);
      setPaginationData(data);
    } catch (err) {
      setError('Failed to load QTI items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchItems(newPage);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">QTI Questions</h1>
      <div className="grid gap-4 mb-4">
        {paginationData.items.map((item) => (
          <Link
            href={`/items/${item.identifier}`}
            key={item.identifier}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-600">ID: {item.identifier}</p>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => handlePageChange(paginationData.page - 1)}
          disabled={paginationData.page === 1}
          className={`px-4 py-2 rounded ${
            paginationData.page === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <span className="mx-4">
          Page {paginationData.page} of {paginationData.pages}
        </span>
        <button
          onClick={() => handlePageChange(paginationData.page + 1)}
          disabled={paginationData.page === paginationData.pages}
          className={`px-4 py-2 rounded ${
            paginationData.page === paginationData.pages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
}
