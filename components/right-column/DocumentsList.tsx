'use client';

import { Encounter } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface DocumentsListProps {
  encounters: Encounter[];
}

export function DocumentsList({ encounters }: DocumentsListProps) {
  // Extract documents from encounters
  const documents = encounters
    .filter(e => e.source_document)
    .map(e => ({
      id: e.id,
      name: e.source_document!,
      type: e.encounter_type,
      date: e.start_date,
      title: e.title,
    }));

  if (documents.length === 0) {
    return null;
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return '🧪';
      case 'imaging':
        return '📷';
      case 'inpatient':
        return '🏥';
      default:
        return '📄';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-4 h-4 text-gray-500" />
          Dokumente
          <span className="text-sm font-normal text-gray-500">
            ({documents.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <span className="text-lg">{getDocumentIcon(doc.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-gray-500">
                  {doc.title && `${doc.title} • `}
                  {formatDate(doc.date)}
                </p>
              </div>
              <button
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Dokument öffnen"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
