'use client';

import { Diagnosis, Medication } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { HeartPulse, AlertCircle, Pill } from 'lucide-react';

interface ChronicConditionsProps {
  diagnoses: Diagnosis[];
  currentMedications?: Medication[];
}

export function ChronicConditions({ diagnoses, currentMedications = [] }: ChronicConditionsProps) {
  if (diagnoses.length === 0 && currentMedications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <CardTitle className="flex items-center gap-2 text-base text-amber-900">
          <HeartPulse className="w-4 h-4 text-amber-600" />
          Chronische Erkrankungen
          {diagnoses.length > 0 && (
            <span className="text-sm font-normal text-amber-600">
              ({diagnoses.length})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Chronic Diagnoses */}
        {diagnoses.length > 0 && (
          <div className="divide-y divide-gray-100">
            {diagnoses.map((diagnosis) => (
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
        )}

        {/* Current Medications */}
        {currentMedications.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="px-3 py-2 bg-gray-50">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
                <Pill className="w-3 h-3" />
                Aktuelle Dauermedikation
              </h4>
            </div>
            <div className="divide-y divide-gray-100">
              {currentMedications.map((medication) => (
                <div
                  key={medication.id}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {medication.name}
                      </span>
                      {medication.dosage && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {medication.dosage}
                          {medication.frequency && ` | ${medication.frequency}`}
                        </p>
                      )}
                    </div>
                    {medication.as_needed && (
                      <Badge variant="default" size="sm">
                        Bei Bedarf
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
