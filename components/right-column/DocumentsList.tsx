'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { FileText, ExternalLink } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type?: string;
}

interface DocumentsListProps {
  documents: Document[];
}

export function DocumentsList({ documents }: DocumentsListProps) {
  if (documents.length === 0) {
    return null;
  }

  const getDocumentIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('labor') || lowerName.includes('befund')) {
      return '🧪';
    }
    if (lowerName.includes('bild') || lowerName.includes('röntgen') || lowerName.includes('mrt') || lowerName.includes('ct')) {
      return '📷';
    }
    if (lowerName.includes('arzt') || lowerName.includes('hausarzt')) {
      return '👨‍⚕️';
    }
    if (lowerName.includes('fragebogen')) {
      return '📋';
    }
    return '📄';
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
              className="p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <span className="text-lg">{getDocumentIcon(doc.name)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.name}
                </p>
                {doc.type && (
                  <p className="text-xs text-gray-500">{doc.type}</p>
                )}
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
