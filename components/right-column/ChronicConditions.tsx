'use client';

import { Diagnosis } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { HeartPulse, AlertCircle } from 'lucide-react';

interface ChronicConditionsProps {
  diagnoses: Diagnosis[];
}

export function ChronicConditions({ diagnoses }: ChronicConditionsProps) {
  // Filter to only chronic diagnoses
  const chronicDiagnoses = diagnoses.filter(d => d.diagnosis_status === 'chronic');

  if (chronicDiagnoses.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <CardTitle className="flex items-center gap-2 text-base text-amber-900">
          <HeartPulse className="w-4 h-4 text-amber-600" />
          Chronische Erkrankungen
          <span className="text-sm font-normal text-amber-600">
            ({chronicDiagnoses.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {chronicDiagnoses.map((diagnosis) => (
            <div
              key={diagnosis.id}
              className="p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">
                      {diagnosis.condition}
                    </span>
                    {diagnosis.needs_review && (
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                    )}
                  </div>
                  {diagnosis.icd10_code && (
                    <code className="text-xs text-gray-500 mt-0.5 block">
                      {diagnosis.icd10_code}
                      {diagnosis.icd10_description && (
                        <span className="ml-1 font-normal">
                          - {diagnosis.icd10_description}
                        </span>
                      )}
                    </code>
                  )}
                </div>
                {diagnosis.risk_score !== null && (
                  <div
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      diagnosis.risk_score >= 7
                        ? 'bg-red-100 text-red-700'
                        : diagnosis.risk_score >= 4
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {diagnosis.risk_score}/10
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
