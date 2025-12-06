'use client';

import { Finding } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { FileText } from 'lucide-react';

interface FindingsListProps {
  findings: Finding[];
  showTitle?: boolean;
}

export function FindingsList({ findings, showTitle = true }: FindingsListProps) {
  const getResultCategoryBadge = (category: string | null) => {
    switch (category) {
      case 'normal':
        return <Badge variant="success">Normal</Badge>;
      case 'abnormal':
        return <Badge variant="warning">Auffällig</Badge>;
      case 'pathological':
        return <Badge variant="danger">Pathologisch</Badge>;
      case 'inconclusive':
        return <Badge variant="default">Unklar</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      {showTitle && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">Befunde</h4>
      )}
      <div className="space-y-2">
        {findings.map((finding) => (
          <div
            key={finding.id}
            className="p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {finding.title || finding.finding_type || 'Befund'}
                  </span>
                  {finding.finding_type && finding.title && (
                    <span className="text-xs text-gray-500">
                      ({finding.finding_type})
                    </span>
                  )}
                  {getResultCategoryBadge(finding.result_category)}
                </div>
                {finding.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {finding.description}
                  </p>
                )}
                {finding.result_summary && (
                  <div className="bg-white p-2 rounded border border-gray-200 text-sm text-gray-700">
                    <span className="text-xs text-gray-500 block mb-1">Zusammenfassung:</span>
                    {finding.result_summary}
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
