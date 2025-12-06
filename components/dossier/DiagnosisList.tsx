'use client';

import { Diagnosis } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge, getDiagnosisStatusBadgeVariant, getDiagnosisStatusLabel } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

interface DiagnosisListProps {
  diagnoses: Diagnosis[];
  showTitle?: boolean;
}

export function DiagnosisList({ diagnoses, showTitle = true }: DiagnosisListProps) {
  // Sort diagnoses: primary first, then by date
  const sortedDiagnoses = [...diagnoses].sort((a, b) => {
    if (a.diagnosis_type === 'primary' && b.diagnosis_type !== 'primary') return -1;
    if (a.diagnosis_type !== 'primary' && b.diagnosis_type === 'primary') return 1;
    return 0;
  });

  return (
    <div>
      {showTitle && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">Diagnosen</h4>
      )}
      <div className="space-y-2">
        {sortedDiagnoses.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{diagnosis.condition}</span>
                {diagnosis.icd10_code && (
                  <span className="text-xs text-gray-500 font-mono bg-gray-200 px-1.5 py-0.5 rounded">
                    {diagnosis.icd10_code}
                  </span>
                )}
                {diagnosis.needs_review && (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge
                  variant={getDiagnosisStatusBadgeVariant(diagnosis.diagnosis_status)}
                  size="sm"
                >
                  {getDiagnosisStatusLabel(diagnosis.diagnosis_status)}
                </Badge>
                {diagnosis.diagnosis_type === 'primary' && (
                  <Badge variant="info" size="sm">
                    Hauptdiagnose
                  </Badge>
                )}
                {diagnosis.diagnosed_date && (
                  <span className="text-gray-500">
                    {formatDate(diagnosis.diagnosed_date)}
                  </span>
                )}
              </div>
              {diagnosis.icd10_description && (
                <p className="text-xs text-gray-500 mt-1">
                  {diagnosis.icd10_description}
                </p>
              )}
            </div>
            {diagnosis.risk_score !== null && (
              <div className="text-right">
                <span className="text-xs text-gray-500">Risiko</span>
                <div
                  className={`text-sm font-medium ${
                    diagnosis.risk_score >= 7
                      ? 'text-red-600'
                      : diagnosis.risk_score >= 4
                      ? 'text-amber-600'
                      : 'text-green-600'
                  }`}
                >
                  {diagnosis.risk_score}/10
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
