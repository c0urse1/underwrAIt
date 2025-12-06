'use client';

import { Medication } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { Pill } from 'lucide-react';

interface MedicationListProps {
  medications: Medication[];
  showTitle?: boolean;
}

export function MedicationList({ medications, showTitle = true }: MedicationListProps) {
  // Sort medications: current first
  const sortedMedications = [...medications].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    return 0;
  });

  return (
    <div>
      {showTitle && (
        <h4 className="text-sm font-medium text-gray-700 mb-2">Medikation</h4>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sortedMedications.map((medication) => (
          <div
            key={medication.id}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <Pill className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 truncate">
                  {medication.name}
                </span>
                {medication.is_current && (
                  <Badge variant="success" size="sm">
                    Aktuell
                  </Badge>
                )}
                {medication.as_needed && (
                  <Badge variant="default" size="sm">
                    Bei Bedarf
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {medication.dosage && (
                  <span className="mr-2">{medication.dosage}</span>
                )}
                {medication.frequency && (
                  <span className="mr-2">| {medication.frequency}</span>
                )}
                {medication.route && (
                  <span className="text-gray-500">({medication.route})</span>
                )}
              </div>
              {medication.indication && (
                <p className="text-xs text-gray-500 mt-1">
                  Indikation: {medication.indication}
                </p>
              )}
              {(medication.start_date || medication.end_date) && (
                <p className="text-xs text-gray-400 mt-1">
                  {medication.start_date && `Seit ${formatDate(medication.start_date)}`}
                  {medication.end_date && ` bis ${formatDate(medication.end_date)}`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
