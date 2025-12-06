'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CaseWithDetails, Diagnosis } from '@/lib/types';
import { getCaseWithDetails, getHistoricalDiagnosesForCase } from '@/lib/queries';
import { LoadingState, EmptyState } from '@/components/ui';
import { ThreeColumnLayout, Header } from '@/components/layout';
import { PersonalDataCard, OccupationCard } from '@/components/left-column';
import { MedicalHistory } from '@/components/middle-column';
import { HistoricalDiagnoses, ChronicConditions, DocumentsList, AllDiagnosesTimeline } from '@/components/right-column';
import { AssistantWidget } from '@/components/assistant';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseWithDetails | null>(null);
  const [historicalDiagnoses, setHistoricalDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCase() {
      if (!caseId) return;

      try {
        const [data, historical] = await Promise.all([
          getCaseWithDetails(caseId),
          getHistoricalDiagnosesForCase(caseId),
        ]);

        if (!data) {
          setError('Fall nicht gefunden');
        } else {
          setCaseData(data);
          setHistoricalDiagnoses(historical);
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
    <div className="-mt-8">
      {/* Case Header */}
      <Header caseData={caseData} />

      {/* Three Column Layout */}
      <ThreeColumnLayout
        leftColumn={
          <>
            <PersonalDataCard caseData={caseData} />
            <OccupationCard caseData={caseData} />
          </>
        }
        middleColumn={
          <MedicalHistory encounters={caseData.encounters} />
        }
        rightColumn={
          <>
            {historicalDiagnoses.length > 0 && (
              <HistoricalDiagnoses diagnoses={historicalDiagnoses} />
            )}
            <ChronicConditions diagnoses={caseData.all_diagnoses} />
            <DocumentsList encounters={caseData.encounters} />
            <AllDiagnosesTimeline diagnoses={caseData.all_diagnoses} />
          </>
        }
      />

      {/* Floating Assistant Widget */}
      <AssistantWidget />
    </div>
  );
}
