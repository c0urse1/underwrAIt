'use client';

import { UnderwritingCase } from '@/lib/types';
import { calculateAge, calculateBMI, formatDate, formatSmokerStatus } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, DataRow } from '@/components/ui';
import { User, Calendar, Ruler, Scale, Activity, Heart } from 'lucide-react';

interface PersonalDataCardProps {
  caseData: UnderwritingCase;
}

export function PersonalDataCard({ caseData }: PersonalDataCardProps) {
  const age = calculateAge(caseData.birth_date);
  const bmi = calculateBMI(caseData.weight, caseData.height);

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return '-';
    const labels: Record<string, string> = {
      male: 'Männlich',
      female: 'Weiblich',
      diverse: 'Divers',
    };
    return labels[gender] || gender;
  };

  const getBMICategory = (bmi: number | null) => {
    if (bmi === null) return null;
    if (bmi < 18.5) return { label: 'Untergewicht', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normalgewicht', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Übergewicht', color: 'text-yellow-600' };
    return { label: 'Adipositas', color: 'text-red-600' };
  };

  const bmiCategory = getBMICategory(bmi);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="w-4 h-4 text-gray-500" />
          Persönliche Daten
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <DataRow
          label="Geburtsdatum"
          value={
            <span className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-gray-400" />
              {formatDate(caseData.birth_date)}
              {age !== null && (
                <span className="text-gray-500">({age} Jahre)</span>
              )}
            </span>
          }
        />

        <DataRow
          label="Geschlecht"
          value={getGenderLabel(caseData.gender)}
        />

        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <DataRow
              label="Größe"
              value={
                <span className="flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-gray-400" />
                  {caseData.height ? `${caseData.height} cm` : '-'}
                </span>
              }
            />
            <DataRow
              label="Gewicht"
              value={
                <span className="flex items-center gap-1">
                  <Scale className="w-3 h-3 text-gray-400" />
                  {caseData.weight ? `${caseData.weight} kg` : '-'}
                </span>
              }
            />
          </div>
        </div>

        <DataRow
          label="BMI"
          value={
            <span className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-gray-400" />
              {bmi !== null ? (
                <>
                  <span className="font-medium">{bmi.toFixed(1)}</span>
                  {bmiCategory && (
                    <span className={`text-xs ${bmiCategory.color}`}>
                      ({bmiCategory.label})
                    </span>
                  )}
                </>
              ) : (
                '-'
              )}
            </span>
          }
        />

        <div className="border-t border-gray-100 pt-3 mt-3">
          <DataRow
            label="Raucherstatus"
            value={
              <span className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-gray-400" />
                <span className={caseData.smoker_status ? 'text-red-600' : 'text-green-600'}>
                  {formatSmokerStatus(caseData.smoker_status)}
                </span>
              </span>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
