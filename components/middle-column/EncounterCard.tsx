'use client';

import { EncounterWithDetails } from '@/lib/types';
import { formatDateRange, getEncounterTypeInfo } from '@/lib/utils';
import { Collapsible, Badge, getEncounterBadgeVariant } from '@/components/ui';
import { DiagnosesList } from './DiagnosesList';
import { LabValuesList } from './LabValuesList';
import { FindingsList } from './FindingsList';
import { MedicationsList } from './MedicationsList';
import { Building, User, FileText } from 'lucide-react';

interface EncounterCardProps {
  encounter: EncounterWithDetails;
  defaultExpanded?: boolean;
}

export function EncounterCard({ encounter, defaultExpanded = false }: EncounterCardProps) {
  const typeInfo = getEncounterTypeInfo(encounter.encounter_type);

  const hasContent =
    encounter.diagnoses.length > 0 ||
    encounter.medications.length > 0 ||
    encounter.lab_values.length > 0 ||
    encounter.findings.length > 0 ||
    encounter.anamnese ||
    encounter.therapy_notes ||
    encounter.discharge_summary;

  // Count badges
  const counts = {
    diagnosen: encounter.diagnoses.length,
    labor: encounter.lab_values.length,
    befunde: encounter.findings.length,
    medikamente: encounter.medications.length,
  };

  const title = (
    <div className="flex items-center gap-3">
      <span className="text-xl">{typeInfo.icon}</span>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            {encounter.title || typeInfo.label}
          </span>
          <Badge variant={getEncounterBadgeVariant(encounter.encounter_type)} size="sm">
            {typeInfo.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <span>{formatDateRange(encounter.start_date, encounter.end_date)}</span>
          {encounter.facility && (
            <span className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              {encounter.facility}
            </span>
          )}
          {encounter.physician && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {encounter.physician}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const badge = (
    <div className="flex gap-2 ml-4">
      {counts.diagnosen > 0 && (
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
          {counts.diagnosen} Diagnosen
        </span>
      )}
      {counts.labor > 0 && (
        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
          {counts.labor} Labor
        </span>
      )}
      {counts.befunde > 0 && (
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
          {counts.befunde} Befunde
        </span>
      )}
    </div>
  );

  if (!hasContent) {
    return (
      <div className="border border-gray-200 rounded-lg bg-white p-4">
        {title}
        <p className="text-sm text-gray-500 mt-2 ml-9">
          Keine Details verfügbar
        </p>
      </div>
    );
  }

  return (
    <Collapsible
      title={title}
      badge={badge}
      defaultOpen={defaultExpanded}
      headerClassName="py-3"
    >
      <div className="space-y-4">
        {/* Anamnese */}
        {encounter.anamnese && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Anamnese
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {encounter.anamnese}
            </p>
          </div>
        )}

        {/* Diagnosen */}
        {encounter.diagnoses.length > 0 && (
          <DiagnosesList diagnoses={encounter.diagnoses} />
        )}

        {/* Laborwerte */}
        {encounter.lab_values.length > 0 && (
          <LabValuesList labValues={encounter.lab_values} />
        )}

        {/* Befunde */}
        {encounter.findings.length > 0 && (
          <FindingsList findings={encounter.findings} />
        )}

        {/* Medikamente */}
        {encounter.medications.length > 0 && (
          <MedicationsList medications={encounter.medications} />
        )}

        {/* Therapieverlauf */}
        {encounter.therapy_notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Therapieverlauf</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {encounter.therapy_notes}
            </p>
          </div>
        )}

        {/* Entlassungsbericht */}
        {encounter.discharge_summary && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Entlassungsbericht</h4>
            <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
              {encounter.discharge_summary}
            </p>
          </div>
        )}
      </div>
    </Collapsible>
  );
}
