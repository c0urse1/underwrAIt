'use client';

import { EncounterWithDetails } from '@/lib/types';
import { EncounterCard } from './EncounterCard';
import { Section, EmptyState } from '@/components/ui';
import { Calendar } from 'lucide-react';

interface EncounterTimelineProps {
  encounters: EncounterWithDetails[];
}

export function EncounterTimeline({ encounters }: EncounterTimelineProps) {
  if (encounters.length === 0) {
    return (
      <Section title="Medizinische Ereignisse" icon={Calendar}>
        <EmptyState
          title="Keine Ereignisse"
          description="Für diesen Fall wurden noch keine medizinischen Ereignisse erfasst."
        />
      </Section>
    );
  }

  return (
    <Section title="Medizinische Ereignisse" icon={Calendar}>
      <div className="space-y-4">
        {encounters.map((encounter, index) => (
          <EncounterCard
            key={encounter.id}
            encounter={encounter}
            defaultExpanded={index === 0}
          />
        ))}
      </div>
    </Section>
  );
}
