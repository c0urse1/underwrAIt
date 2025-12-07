'use client';

import { Diagnosis } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge, getDiagnosisStatusBadgeVariant, getDiagnosisStatusLabel } from '@/components/ui';
import { Stethoscope, AlertCircle } from 'lucide-react';

interface DiagnosesListProps {
  diagnoses: Diagnosis[];
}

export function DiagnosesList({ diagnoses }: DiagnosesListProps) {
  // Sort: primary first
  const sorted = [...diagnoses].sort((a, b) => {
    if (a.diagnosis_type === 'primary' && b.diagnosis_type !== 'primary') return -1;
    if (a.diagnosis_type !== 'primary' && b.diagnosis_type === 'primary') return 1;
    return 0;
  });

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Stethoscope className="w-4 h-4" />
        Diagnosen ({diagnoses.length})
      </h4>
      <div className="space-y-2">
        {sorted.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className={`p-3 rounded-lg border ${
              diagnosis.diagnosis_type === 'primary'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">
                    {diagnosis.condition}
                  </span>
                  {diagnosis.icd10_code && (
                    <code className="text-xs bg-white text-gray-600 px-1.5 py-0.5 rounded border">
                      {diagnosis.icd10_code}
                    </code>
                  )}
                  {diagnosis.needs_review && (
                    <span className="flex items-center gap-1 text-amber-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      Prüfung nötig
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
                    <span className="text-xs text-gray-500">
                      Diagnose: {formatDate(diagnosis.diagnosed_date)}
                    </span>
                  )}
                </div>
              </div>
              {diagnosis.risk_score !== null && (
                <div className="text-right ml-3">
                  <div
                    className={`text-sm font-bold px-2 py-1 rounded ${
                      diagnosis.risk_score >= 7
                        ? 'bg-red-100 text-red-700'
                        : diagnosis.risk_score >= 4
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {diagnosis.risk_score}/10
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
