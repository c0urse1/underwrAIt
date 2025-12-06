'use client';

import { Medication } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui';
import { Pill } from 'lucide-react';

interface MedicationsListProps {
  medications: Medication[];
}

export function MedicationsList({ medications }: MedicationsListProps) {
  // Sort: current first
  const sorted = [...medications].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    return 0;
  });

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Pill className="w-4 h-4" />
        Medikamente ({medications.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sorted.map((medication) => (
          <div
            key={medication.id}
            className={`p-3 rounded-lg border ${
              medication.is_current
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-2">
              <Pill className={`w-4 h-4 mt-0.5 ${
                medication.is_current ? 'text-green-500' : 'text-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 truncate">
                    {medication.name}
                  </span>
                  {medication.is_current && (
                    <Badge variant="success" size="sm">Aktuell</Badge>
                  )}
                  {medication.as_needed && (
                    <Badge variant="default" size="sm">Bei Bedarf</Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {medication.dosage && <span>{medication.dosage}</span>}
                  {medication.frequency && (
                    <span className="text-gray-400"> | {medication.frequency}</span>
                  )}
                </div>
                {medication.indication && (
                  <p className="text-xs text-gray-500 mt-1">
                    {medication.indication}
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
          </div>
        ))}
      </div>
    </div>
  );
}
