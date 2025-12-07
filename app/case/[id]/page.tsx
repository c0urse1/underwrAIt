import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { PersonalDataCard } from '@/components/left-column/PersonalDataCard';
import { OccupationCard } from '@/components/left-column/OccupationCard';
import { MedicalHistory } from '@/components/middle-column/MedicalHistory';
import { HistoricalDiagnoses } from '@/components/right-column/HistoricalDiagnoses';
import { ChronicConditions } from '@/components/right-column/ChronicConditions';
import { DocumentsList } from '@/components/right-column/DocumentsList';
import { AllDiagnosesTimeline } from '@/components/right-column/AllDiagnosesTimeline';
import { AssistantWidget } from '@/components/assistant/AssistantWidget';
import {
  getCaseWithDetails,
  getHistoricalDiagnosesForCase,
  getChronicConditionsForCase,
  getCurrentMedicationsForCase,
} from '@/lib/queries';

export const dynamic = 'force-dynamic';

interface CasePageProps {
  params: Promise<{ id: string }>;
}

export default async function CasePage({ params }: CasePageProps) {
  const { id } = await params;

  // Fetch all data in parallel
  const [caseData, historicalDiagnoses, chronicConditions, currentMedications] = await Promise.all([
    getCaseWithDetails(id),
    getHistoricalDiagnosesForCase(id),
    getChronicConditionsForCase(id),
    getCurrentMedicationsForCase(id),
  ]);

  if (!caseData) {
    notFound();
  }

  // Extract documents from encounters
  const documents = caseData.encounters
    .filter(e => e.source_document)
    .map(e => ({
      id: e.id,
      name: e.source_document!,
      type: 'PDF',
    }));

  // Add some placeholder documents
  const allDocuments = [
    ...documents,
    { id: 'doc-1', name: 'Befundbericht.pdf', type: 'PDF' },
    { id: 'doc-2', name: 'Nachsorgebericht Hausarzt', type: 'PDF' },
    { id: 'doc-3', name: 'Zusatzfragebogen Diabetes', type: 'PDF' },
  ].filter((doc, index, self) =>
    index === self.findIndex(d => d.name === doc.name)
  );

  return (
    <div className="-mt-8">
      {/* Header */}
      <Header
        name={caseData.name || undefined}
        caseNumber={caseData.id.slice(0, 8).toUpperCase()}
        submittedDate={caseData.created_at}
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
              <HistoricalDiagnoses diagnoses={historicalDiagnoses} />
              <ChronicConditions
                diagnoses={chronicConditions}
                currentMedications={currentMedications}
              />
              <DocumentsList documents={allDocuments} />
              <AllDiagnosesTimeline diagnoses={caseData.all_diagnoses} />
            </>
          }
        />
      </div>

      {/* Floating Assistant Widget */}
      <AssistantWidget />
    </div>
  );
}
