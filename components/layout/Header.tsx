'use client';

import { UnderwritingCase } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  caseData: UnderwritingCase;
}

export function Header({ caseData }: HeaderProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'complete':
        return 'success';
      case 'review':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      collecting: 'Erfassung',
      review: 'In Prüfung',
      complete: 'Abgeschlossen',
      rejected: 'Abgelehnt',
    };
    return labels[status] || status;
  };

  // Generate a case number from the ID
  const caseNumber = `${new Date(caseData.created_at).getFullYear()}-${caseData.id.slice(0, 4).toUpperCase()}`;

  return (
    <div className="bg-white border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FileText className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">
                BU-Dossier
              </h1>
              <span className="text-gray-400">•</span>
              <span className="text-xl font-semibold text-gray-700">
                {caseData.name || 'Unbekannt'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 font-mono">
                Fall #{caseNumber}
              </span>
              <Badge variant={getStatusBadgeVariant(caseData.status)}>
                {getStatusLabel(caseData.status)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Eingereicht: {formatDate(caseData.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
