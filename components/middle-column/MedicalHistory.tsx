'use client';

import { EncounterWithDetails } from '@/lib/types';
import { EncounterCard } from './EncounterCard';
import { EmptyState } from '@/components/ui';
import { Calendar, Activity } from 'lucide-react';

interface MedicalHistoryProps {
  encounters: EncounterWithDetails[];
}

export function MedicalHistory({ encounters }: MedicalHistoryProps) {
  if (encounters.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <EmptyState
          icon={Activity}
          title="Keine medizinischen Ereignisse"
          description="Für diesen Fall wurden noch keine medizinischen Ereignisse erfasst."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          Medizinische Historie
          <span className="text-sm font-normal text-gray-500">
            ({encounters.length} {encounters.length === 1 ? 'Episode' : 'Episoden'})
          </span>
        </h2>
      </div>
      <div className="space-y-3">
        {encounters.map((encounter, index) => (
          <EncounterCard
            key={encounter.id}
            encounter={encounter}
            defaultExpanded={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
