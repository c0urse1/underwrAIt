'use client';

import { UnderwritingCase } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, DataRow } from '@/components/ui';
import { Briefcase, Dumbbell, AlertTriangle } from 'lucide-react';

interface OccupationCardProps {
  caseData: UnderwritingCase;
}

export function OccupationCard({ caseData }: OccupationCardProps) {
  const getRiskBadgeVariant = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'hoch':
        return 'danger';
      case 'medium':
      case 'mittel':
        return 'warning';
      case 'low':
      case 'niedrig':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskLabel = (level: string | undefined) => {
    if (!level) return null;
    const labels: Record<string, string> = {
      high: 'Hohes Risiko',
      hoch: 'Hohes Risiko',
      medium: 'Mittleres Risiko',
      mittel: 'Mittleres Risiko',
      low: 'Niedriges Risiko',
      niedrig: 'Niedriges Risiko',
    };
    return labels[level.toLowerCase()] || level;
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase className="w-4 h-4 text-gray-500" />
          Beruf & Freizeit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Beruf */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Beruf
          </h4>
          {caseData.occupation ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {caseData.occupation.title || '-'}
                </span>
                {caseData.occupation.risk_level && (
                  <Badge
                    variant={getRiskBadgeVariant(caseData.occupation.risk_level)}
                    size="sm"
                  >
                    {getRiskLabel(caseData.occupation.risk_level)}
                  </Badge>
                )}
              </div>
              {caseData.occupation.type && (
                <p className="text-sm text-gray-500">{caseData.occupation.type}</p>
              )}
              {caseData.occupation.physical_demands && caseData.occupation.physical_demands.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {caseData.occupation.physical_demands.map((demand, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {demand}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Keine Angaben</p>
          )}
        </div>

        {/* Jahreseinkommen */}
        {caseData.annual_income !== null && (
          <div className="border-t border-gray-100 pt-3">
            <DataRow
              label="Jahreseinkommen"
              value={
                <span className="font-medium">
                  {formatCurrency(caseData.annual_income)}
                </span>
              }
            />
          </div>
        )}

        {/* Hobbys */}
        <div className="border-t border-gray-100 pt-3">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Dumbbell className="w-3 h-3" />
            Hobbys & Freizeitaktivitäten
          </h4>
          {caseData.hobbies && caseData.hobbies.length > 0 ? (
            <div className="space-y-2">
              {caseData.hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    hobby.risk_level === 'high'
                      ? 'bg-red-50'
                      : hobby.risk_level === 'medium'
                      ? 'bg-yellow-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {hobby.risk_level === 'high' && (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {hobby.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hobby.frequency && (
                      <span className="text-xs text-gray-500">
                        {hobby.frequency}
                      </span>
                    )}
                    {hobby.risk_level && (
                      <Badge
                        variant={getRiskBadgeVariant(hobby.risk_level)}
                        size="sm"
                      >
                        {getRiskLabel(hobby.risk_level)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Keine Angaben</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
