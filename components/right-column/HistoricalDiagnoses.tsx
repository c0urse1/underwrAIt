'use client';

import { Diagnosis } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, Badge, getDiagnosisStatusBadgeVariant, getDiagnosisStatusLabel } from '@/components/ui';
import { History, Clock } from 'lucide-react';

interface HistoricalDiagnosesProps {
  diagnoses: Diagnosis[];
}

export function HistoricalDiagnoses({ diagnoses }: HistoricalDiagnosesProps) {
  if (diagnoses.length === 0) {
    return null;
  }

  // Sort by date descending
  const sorted = [...diagnoses].sort((a, b) => {
    if (!a.diagnosed_date) return 1;
    if (!b.diagnosed_date) return -1;
    return new Date(b.diagnosed_date).getTime() - new Date(a.diagnosed_date).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="w-4 h-4 text-gray-500" />
          Außerhalb des Abfragezeitraums
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-4">
            {sorted.map((diagnosis) => (
              <div key={diagnosis.id} className="relative pl-6">
                {/* Timeline Dot */}
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gray-300 border-2 border-white" />

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-gray-900 text-sm">
                        {diagnosis.condition}
                      </span>
                      {diagnosis.icd10_code && (
                        <code className="ml-2 text-xs bg-white text-gray-500 px-1 py-0.5 rounded">
                          {diagnosis.icd10_code}
                        </code>
                      )}
                    </div>
                    <Badge
                      variant={getDiagnosisStatusBadgeVariant(diagnosis.diagnosis_status)}
                      size="sm"
                    >
                      {getDiagnosisStatusLabel(diagnosis.diagnosis_status)}
                    </Badge>
                  </div>
                  {diagnosis.diagnosed_date && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatDate(diagnosis.diagnosed_date)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
