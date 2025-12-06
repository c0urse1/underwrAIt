'use client';

import { useEffect, useState } from 'react';
import { UnderwritingCase } from '@/lib/types';
import { getAllCases } from '@/lib/queries';
import { formatDate, calculateAge } from '@/lib/utils';
import { Card, CardContent, Badge, LoadingState, EmptyState } from '@/components/ui';
import { User, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [cases, setCases] = useState<UnderwritingCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCases() {
      try {
        const data = await getAllCases();
        setCases(data);
      } catch (err) {
        setError('Fehler beim Laden der Fälle');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

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

  if (loading) {
    return <LoadingState message="Fälle werden geladen..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Underwriting-Fälle</h1>
        <p className="text-gray-600 mt-1">
          {cases.length} {cases.length === 1 ? 'Fall' : 'Fälle'} verfügbar
        </p>
      </div>

      {cases.length === 0 ? (
        <EmptyState
          title="Keine Fälle vorhanden"
          description="Es wurden noch keine Underwriting-Fälle erstellt."
        />
      ) : (
        <div className="grid gap-4">
          {cases.map((caseData) => {
            const age = calculateAge(caseData.birth_date);

            return (
              <Link key={caseData.id} href={`/case/${caseData.id}`}>
                <Card hover className="p-0">
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {caseData.name || 'Unbekannt'}
                          </h2>
                          <Badge variant={getStatusBadgeVariant(caseData.status)}>
                            {getStatusLabel(caseData.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          {caseData.birth_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(caseData.birth_date)}
                              {age !== null && ` (${age} J.)`}
                            </span>
                          )}
                          {caseData.occupation?.title && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {caseData.occupation.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
