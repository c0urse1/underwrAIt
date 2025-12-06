'use client';

import { Diagnosis } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, getDiagnosisStatusBadgeVariant, getDiagnosisStatusLabel } from '@/components/ui';
import { Stethoscope, AlertCircle } from 'lucide-react';

interface DiagnosisSummaryProps {
  diagnoses: Diagnosis[];
}

export function DiagnosisSummary({ diagnoses }: DiagnosisSummaryProps) {
  // Group diagnoses by status
  const chronicDiagnoses = diagnoses.filter((d) => d.diagnosis_status === 'chronic');
  const activeDiagnoses = diagnoses.filter((d) => d.diagnosis_status === 'active');
  const suspectedDiagnoses = diagnoses.filter((d) => d.diagnosis_status === 'suspected');
  const needsReview = diagnoses.filter((d) => d.needs_review);

  // Get unique conditions for summary
  const uniqueConditions = new Map<string, Diagnosis>();
  diagnoses.forEach((d) => {
    const key = d.icd10_code || d.condition;
    if (!uniqueConditions.has(key) || d.diagnosis_type === 'primary') {
      uniqueConditions.set(key, d);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-gray-500" />
          Diagnoseübersicht
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {uniqueConditions.size}
            </div>
            <div className="text-xs text-gray-500">Diagnosen gesamt</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">
              {chronicDiagnoses.length}
            </div>
            <div className="text-xs text-gray-500">Chronisch</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {activeDiagnoses.length}
            </div>
            <div className="text-xs text-gray-500">Aktiv</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {needsReview.length}
            </div>
            <div className="text-xs text-gray-500">Prüfung nötig</div>
          </div>
        </div>

        {/* Chronic Conditions */}
        {chronicDiagnoses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Chronische Erkrankungen
            </h4>
            <div className="space-y-2">
              {chronicDiagnoses.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  className="flex items-center justify-between p-2 bg-amber-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {diagnosis.condition}
                    </span>
                    {diagnosis.icd10_code && (
                      <span className="text-xs text-gray-500 font-mono">
                        {diagnosis.icd10_code}
                      </span>
                    )}
                    {diagnosis.needs_review && (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  {diagnosis.risk_score !== null && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        diagnosis.risk_score >= 7
                          ? 'bg-red-100 text-red-700'
                          : diagnosis.risk_score >= 4
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      Risiko: {diagnosis.risk_score}/10
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Conditions */}
        {activeDiagnoses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Aktive Erkrankungen
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeDiagnoses.map((diagnosis) => (
                <Badge key={diagnosis.id} variant="active" size="md">
                  {diagnosis.condition}
                  {diagnosis.icd10_code && ` (${diagnosis.icd10_code})`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suspected Conditions */}
        {suspectedDiagnoses.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              Verdachtsdiagnosen
            </h4>
            <div className="flex flex-wrap gap-2">
              {suspectedDiagnoses.map((diagnosis) => (
                <Badge key={diagnosis.id} variant="suspected" size="md">
                  {diagnosis.condition}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {diagnoses.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Keine Diagnosen erfasst
          </p>
        )}
      </CardContent>
    </Card>
  );
}
