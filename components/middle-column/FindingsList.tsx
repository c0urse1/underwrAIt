'use client';

import { Finding } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { FileSearch, CheckCircle, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

interface FindingsListProps {
  findings: Finding[];
}

export function FindingsList({ findings }: FindingsListProps) {
  const getResultIcon = (category: string | null) => {
    switch (category) {
      case 'normal':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'abnormal':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'pathological':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'inconclusive':
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getResultBadge = (category: string | null) => {
    switch (category) {
      case 'normal':
        return <Badge variant="success" size="sm">Normal</Badge>;
      case 'abnormal':
        return <Badge variant="warning" size="sm">Auffällig</Badge>;
      case 'pathological':
        return <Badge variant="danger" size="sm">Pathologisch</Badge>;
      case 'inconclusive':
        return <Badge variant="default" size="sm">Unklar</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <FileSearch className="w-4 h-4" />
        Befunde ({findings.length})
      </h4>
      <div className="space-y-2">
        {findings.map((finding) => (
          <div
            key={finding.id}
            className={`p-3 rounded-lg border ${
              finding.result_category === 'pathological'
                ? 'bg-red-50 border-red-200'
                : finding.result_category === 'abnormal'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {getResultIcon(finding.result_category)}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">
                    {finding.title || finding.finding_type || 'Befund'}
                  </span>
                  {finding.finding_type && finding.title && (
                    <span className="text-xs text-gray-500">
                      ({finding.finding_type})
                    </span>
                  )}
                  {getResultBadge(finding.result_category)}
                </div>
                {finding.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {finding.description}
                  </p>
                )}
                {finding.result_summary && (
                  <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-sm">
                    <span className="text-xs text-gray-500 block mb-1">
                      Zusammenfassung:
                    </span>
                    <p className="text-gray-700">{finding.result_summary}</p>
                  </div>
                )}
                {finding.performed_at && (
                  <p className="text-xs text-gray-400 mt-2">
                    Durchgeführt: {formatDate(finding.performed_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
