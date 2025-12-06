'use client';

import { Medication } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Pill } from 'lucide-react';

interface MedicationSummaryProps {
  medications: Medication[];
}

export function MedicationSummary({ medications }: MedicationSummaryProps) {
  const currentMedications = medications.filter((m) => m.is_current);
  const pastMedications = medications.filter((m) => !m.is_current);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-gray-500" />
          Aktuelle Medikation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentMedications.length > 0 ? (
          <div className="space-y-3">
            {currentMedications.map((medication) => (
              <div
                key={medication.id}
                className="flex items-start justify-between p-3 bg-green-50 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {medication.name}
                    </span>
                    {medication.as_needed && (
                      <Badge variant="default" size="sm">
                        Bei Bedarf
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {medication.dosage}
                    {medication.frequency && ` | ${medication.frequency}`}
                  </div>
                  {medication.indication && (
                    <div className="text-xs text-gray-500 mt-1">
                      {medication.indication}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Keine aktuelle Dauermedikation
          </p>
        )}

        {pastMedications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Frühere Medikation ({pastMedications.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {pastMedications.slice(0, 5).map((medication) => (
                <Badge key={medication.id} variant="default" size="sm">
                  {medication.name}
                </Badge>
              ))}
              {pastMedications.length > 5 && (
                <Badge variant="default" size="sm">
                  +{pastMedications.length - 5} weitere
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
