'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { qtiService } from '../../../services/qtiService';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Builder } from 'xml2js';
import QtiAssessmentItem from '../../../../templates/test-components/QtiAssessmentItem';

interface QTIItem {
  identifier: string;
  title: string;
  content: any;
}

const jsonToXml = (obj: any): string => {
  const builder = new Builder({
    renderOpts: { pretty: true, indent: '  ' },
    headless: true,
    xmldec: { version: '1.0', encoding: 'UTF-8' }
  });

  try {
    return builder.buildObject(obj);
  } catch (error) {
    console.error('Error converting to XML:', error);
    return 'Error converting to XML';
  }
};

export default function ItemDetail() {
  const params = useParams();
  const identifier = params.identifier as string;
  const [item, setItem] = useState<QTIItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await qtiService.getItem(identifier);
        setItem(data);
      } catch (err) {
        setError('Failed to load QTI item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [identifier]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!item) return <div className="p-4">Item not found</div>;

  const xmlContent = jsonToXml(item.content);

  console.log(xmlContent);

  return (
    <main className="p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Questions
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
        <h1 className="text-2xl font-bold mb-4">{item.title}</h1>

        <div className="space-y-8">
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-4">Interactive Preview</h2>
            <div className="qti3-player-container-fluid qti3-player-container-padding-2 qti3-player-color-default bg-white p-6 rounded-lg border">
              <QtiAssessmentItem template={xmlContent} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">QTI XML Representation</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm font-mono whitespace-pre">
              {xmlContent}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
