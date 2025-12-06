'use client';

import { UnderwritingCase } from '@/lib/types';
import { calculateAge, calculateBMI, formatDate, formatSmokerStatus } from '@/lib/utils';
import { Card, CardContent, Badge, DataRow, DataGrid } from '@/components/ui';
import { User, Calendar, Briefcase, Activity, Scale, Ruler } from 'lucide-react';

interface PatientHeaderProps {
  caseData: UnderwritingCase;
}

export function PatientHeader({ caseData }: PatientHeaderProps) {
  const age = calculateAge(caseData.birth_date);
  const bmi = calculateBMI(caseData.weight, caseData.height);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'complete':
        return 'success';
      case 'review':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      collecting: 'Erfassung',
      review: 'In Prüfung',
      complete: 'Abgeschlossen',
      rejected: 'Abgelehnt',
    };
    return labels[status] || status;
  };

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return '-';
    const labels: Record<string, string> = {
      male: 'Männlich',
      female: 'Weiblich',
      diverse: 'Divers',
    };
    return labels[gender] || gender;
  };

  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {caseData.name || 'Unbekannt'}
                </h2>
                <Badge variant={getStatusBadgeVariant(caseData.status)}>
                  {getStatusLabel(caseData.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                {caseData.birth_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(caseData.birth_date)}
                    {age !== null && ` (${age} Jahre)`}
                  </span>
                )}
                <span>{getGenderLabel(caseData.gender)}</span>
                {caseData.occupation?.title && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {caseData.occupation.title}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <DataGrid columns={4}>
            <DataRow
              label="Größe"
              value={
                <span className="flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-gray-400" />
                  {caseData.height ? `${caseData.height} cm` : '-'}
                </span>
              }
            />
            <DataRow
              label="Gewicht"
              value={
                <span className="flex items-center gap-1">
                  <Scale className="w-4 h-4 text-gray-400" />
                  {caseData.weight ? `${caseData.weight} kg` : '-'}
                </span>
              }
            />
            <DataRow
              label="BMI"
              value={
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-gray-400" />
                  {bmi !== null ? bmi.toFixed(1) : '-'}
                </span>
              }
            />
            <DataRow
              label="Raucherstatus"
              value={formatSmokerStatus(caseData.smoker_status)}
            />
          </DataGrid>
        </div>

        {caseData.hobbies && caseData.hobbies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="data-label block mb-2">Hobbys</span>
            <div className="flex flex-wrap gap-2">
              {caseData.hobbies.map((hobby, index) => (
                <Badge
                  key={index}
                  variant={
                    hobby.risk_level === 'high'
                      ? 'danger'
                      : hobby.risk_level === 'medium'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {hobby.name}
                  {hobby.frequency && ` (${hobby.frequency})`}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
