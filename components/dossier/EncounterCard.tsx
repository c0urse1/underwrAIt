'use client';

import { EncounterWithDetails } from '@/lib/types';
import { formatDateRange, getEncounterTypeInfo } from '@/lib/utils';
import { Card, CardHeader, CardContent, Badge, getEncounterBadgeVariant } from '@/components/ui';
import { DiagnosisList } from './DiagnosisList';
import { MedicationList } from './MedicationList';
import { LabValueTable } from './LabValueTable';
import { FindingsList } from './FindingsList';
import { Building, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface EncounterCardProps {
  encounter: EncounterWithDetails;
  defaultExpanded?: boolean;
}

export function EncounterCard({ encounter, defaultExpanded = false }: EncounterCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const typeInfo = getEncounterTypeInfo(encounter.encounter_type);

  const hasDetails =
    encounter.diagnoses.length > 0 ||
    encounter.medications.length > 0 ||
    encounter.lab_values.length > 0 ||
    encounter.findings.length > 0 ||
    encounter.anamnese ||
    encounter.therapy_notes ||
    encounter.discharge_summary;

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{typeInfo.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {encounter.title || typeInfo.label}
                </h3>
                <Badge variant={getEncounterBadgeVariant(encounter.encounter_type)} size="sm">
                  {typeInfo.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
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
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {encounter.diagnoses.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {encounter.diagnoses.length} Diagnosen
                </span>
              )}
              {encounter.medications.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {encounter.medications.length} Medikamente
                </span>
              )}
              {encounter.lab_values.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {encounter.lab_values.length} Laborwerte
                </span>
              )}
            </div>
            {hasDetails && (
              isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && hasDetails && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Anamnese */}
            {encounter.anamnese && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Anamnese</h4>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {encounter.anamnese}
                </p>
              </div>
            )}

            {/* Diagnoses */}
            {encounter.diagnoses.length > 0 && (
              <DiagnosisList diagnoses={encounter.diagnoses} />
            )}

            {/* Medications */}
            {encounter.medications.length > 0 && (
              <MedicationList medications={encounter.medications} />
            )}

            {/* Lab Values */}
            {encounter.lab_values.length > 0 && (
              <LabValueTable labValues={encounter.lab_values} />
            )}

            {/* Findings */}
            {encounter.findings.length > 0 && (
              <FindingsList findings={encounter.findings} />
            )}

            {/* Therapy Notes */}
            {encounter.therapy_notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Therapieverlauf</h4>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {encounter.therapy_notes}
                </p>
              </div>
            )}

            {/* Discharge Summary */}
            {encounter.discharge_summary && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Entlassungsbericht</h4>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  {encounter.discharge_summary}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
