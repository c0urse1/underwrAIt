'use client';

import { useState } from 'react';
import { Diagnosis } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, Badge, getDiagnosisStatusBadgeVariant, getDiagnosisStatusLabel, Collapsible } from '@/components/ui';
import { List, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface AllDiagnosesTimelineProps {
  diagnoses: Diagnosis[];
}

export function AllDiagnosesTimeline({ diagnoses }: AllDiagnosesTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (diagnoses.length === 0) {
    return null;
  }

  // Sort by date descending
  const sorted = [...diagnoses].sort((a, b) => {
    if (!a.diagnosed_date) return 1;
    if (!b.diagnosed_date) return -1;
    return new Date(b.diagnosed_date).getTime() - new Date(a.diagnosed_date).getTime();
  });

  // Show first 5 or all
  const displayDiagnoses = isExpanded ? sorted : sorted.slice(0, 5);
  const hasMore = sorted.length > 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <List className="w-4 h-4 text-gray-500" />
          Vollständige Diagnosen
          <span className="text-sm font-normal text-gray-500">
            ({diagnoses.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {displayDiagnoses.map((diagnosis) => (
            <div
              key={diagnosis.id}
              className="p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 text-sm">
                      {diagnosis.condition}
                    </span>
                    {diagnosis.needs_review && (
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {diagnosis.icd10_code && (
                      <code className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                        {diagnosis.icd10_code}
                      </code>
                    )}
                    <Badge
                      variant={getDiagnosisStatusBadgeVariant(diagnosis.diagnosis_status)}
                      size="sm"
                    >
                      {getDiagnosisStatusLabel(diagnosis.diagnosis_status)}
                    </Badge>
                    {diagnosis.diagnosis_type === 'primary' && (
                      <Badge variant="info" size="sm">HD</Badge>
                    )}
                  </div>
                  {diagnosis.diagnosed_date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(diagnosis.diagnosed_date)}
                    </p>
                  )}
                </div>
                {diagnosis.risk_score !== null && (
                  <div
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      diagnosis.risk_score >= 7
                        ? 'bg-red-100 text-red-700'
                        : diagnosis.risk_score >= 4
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {diagnosis.risk_score}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-3 text-center text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 border-t border-gray-100"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Weniger anzeigen
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Alle {sorted.length} Diagnosen anzeigen
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
