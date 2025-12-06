'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CaseWithDetails } from '@/lib/types';
import { getCaseWithDetails } from '@/lib/queries';
import { LoadingState, EmptyState } from '@/components/ui';
import {
  PatientHeader,
  EncounterTimeline,
  DiagnosisSummary,
  MedicationSummary,
} from '@/components/dossier';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCase() {
      if (!caseId) return;

      try {
        const data = await getCaseWithDetails(caseId);
        if (!data) {
          setError('Fall nicht gefunden');
        } else {
          setCaseData(data);
        }
      } catch (err) {
        setError('Fehler beim Laden des Falls');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCase();
  }, [caseId]);

  if (loading) {
    return <LoadingState message="Dossier wird geladen..." />;
  }

  if (error || !caseData) {
    return (
      <div className="text-center py-12">
        <EmptyState
          title={error || 'Fall nicht gefunden'}
          description="Der angeforderte Fall konnte nicht geladen werden."
        />
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      {/* Patient Header */}
      <PatientHeader caseData={caseData} />

      {/* Two-Column Layout for Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DiagnosisSummary diagnoses={caseData.all_diagnoses} />
        <MedicationSummary medications={caseData.all_medications} />
      </div>

      {/* Encounter Timeline */}
      <EncounterTimeline encounters={caseData.encounters} />
    </div>
  );
}
