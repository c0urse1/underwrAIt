'use client';

import { LabValue } from '@/lib/types';
import { formatDate, getLabValueStatus, getLabValueStatusLabel } from '@/lib/utils';
import { FlaskConical, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';

interface LabValuesListProps {
  labValues: LabValue[];
}

export function LabValuesList({ labValues }: LabValuesListProps) {
  // Sort: abnormal first
  const sorted = [...labValues].sort((a, b) => {
    if (a.is_abnormal && !b.is_abnormal) return -1;
    if (!a.is_abnormal && b.is_abnormal) return 1;
    return a.parameter.localeCompare(b.parameter);
  });

  const getStatusIcon = (labValue: LabValue) => {
    if (!labValue.is_abnormal) return null;

    const isCritical = labValue.abnormality_direction?.includes('critical');

    if (isCritical) {
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
    if (labValue.abnormality_direction === 'high' || labValue.abnormality_direction === 'critical_high') {
      return <ArrowUp className="w-4 h-4 text-red-500" />;
    }
    if (labValue.abnormality_direction === 'low' || labValue.abnormality_direction === 'critical_low') {
      return <ArrowDown className="w-4 h-4 text-blue-500" />;
    }
    return null;
  };

  const getValueClass = (labValue: LabValue) => {
    const status = getLabValueStatus(labValue);
    switch (status) {
      case 'critical': return 'text-red-700 font-bold';
      case 'high': return 'text-red-600 font-medium';
      case 'low': return 'text-blue-600 font-medium';
      case 'warning': return 'text-amber-600 font-medium';
      default: return 'text-gray-900';
    }
  };

  const abnormalCount = labValues.filter(lv => lv.is_abnormal).length;

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <FlaskConical className="w-4 h-4" />
        Laborwerte ({labValues.length})
        {abnormalCount > 0 && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            {abnormalCount} auffällig
          </span>
        )}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
              <th className="pb-2 font-medium">Parameter</th>
              <th className="pb-2 font-medium">Wert</th>
              <th className="pb-2 font-medium">Referenz</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Datum</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((labValue) => {
              const status = getLabValueStatus(labValue);
              return (
                <tr
                  key={labValue.id}
                  className={`border-b border-gray-100 ${
                    labValue.is_abnormal ? 'bg-red-50/50' : ''
                  }`}
                >
                  <td className="py-2 font-medium text-gray-900">
                    {labValue.parameter}
                  </td>
                  <td className={`py-2 ${getValueClass(labValue)}`}>
                    <span className="flex items-center gap-1">
                      {labValue.value ?? labValue.value_text ?? '-'}
                      {labValue.unit && (
                        <span className="text-gray-500 font-normal text-xs">
                          {labValue.unit}
                        </span>
                      )}
                      {getStatusIcon(labValue)}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500 text-xs">
                    {labValue.reference_range ||
                      (labValue.reference_low !== null && labValue.reference_high !== null
                        ? `${labValue.reference_low}-${labValue.reference_high}`
                        : '-')}
                  </td>
                  <td className="py-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        status === 'normal' ? 'bg-green-100 text-green-700' :
                        status === 'critical' ? 'bg-red-100 text-red-700' :
                        status === 'high' ? 'bg-red-50 text-red-600' :
                        status === 'low' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {getLabValueStatusLabel(status)}
                    </span>
                  </td>
                  <td className="py-2 text-gray-500 text-xs">
                    {formatDate(labValue.measured_date)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
