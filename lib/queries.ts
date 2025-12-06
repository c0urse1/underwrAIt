import { supabase } from './supabase';
import {
  UnderwritingCase,
  Encounter,
  Diagnosis,
  Medication,
  LabValue,
  Finding,
  EncounterWithDetails,
  CaseWithDetails,
} from './types';

// Get a single case by ID
export async function getCase(caseId: string): Promise<UnderwritingCase | null> {
  const { data, error } = await supabase
    .from('underwriting_cases')
    .select('*')
    .eq('id', caseId)
    .single();

  if (error) {
    console.error('Error fetching case:', error);
    return null;
  }

  return data;
}

// Get all cases
export async function getAllCases(): Promise<UnderwritingCase[]> {
  const { data, error } = await supabase
    .from('underwriting_cases')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cases:', error);
    return [];
  }

  return data || [];
}

// Get encounters for a case
export async function getEncountersForCase(caseId: string): Promise<Encounter[]> {
  const { data, error } = await supabase
    .from('encounters')
    .select('*')
    .eq('case_id', caseId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching encounters:', error);
    return [];
  }

  return data || [];
}

// Get all encounters (when no case filter is needed)
export async function getAllEncounters(): Promise<Encounter[]> {
  const { data, error } = await supabase
    .from('encounters')
    .select('*')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching encounters:', error);
    return [];
  }

  return data || [];
}

// Get diagnoses for an encounter
export async function getDiagnosesForEncounter(encounterId: string): Promise<Diagnosis[]> {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('encounter_id', encounterId)
    .order('diagnosis_type', { ascending: true });

  if (error) {
    console.error('Error fetching diagnoses:', error);
    return [];
  }

  return data || [];
}

// Get all diagnoses for a case
export async function getDiagnosesForCase(caseId: string): Promise<Diagnosis[]> {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('case_id', caseId)
    .order('diagnosed_date', { ascending: false });

  if (error) {
    console.error('Error fetching diagnoses:', error);
    return [];
  }

  return data || [];
}

// Get medications for an encounter
export async function getMedicationsForEncounter(encounterId: string): Promise<Medication[]> {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('encounter_id', encounterId);

  if (error) {
    console.error('Error fetching medications:', error);
    return [];
  }

  return data || [];
}

// Get all medications for a case
export async function getMedicationsForCase(caseId: string): Promise<Medication[]> {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('case_id', caseId)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching medications:', error);
    return [];
  }

  return data || [];
}

// Get lab values for an encounter
export async function getLabValuesForEncounter(encounterId: string): Promise<LabValue[]> {
  const { data, error } = await supabase
    .from('lab_values')
    .select('*')
    .eq('encounter_id', encounterId)
    .order('measured_date', { ascending: false });

  if (error) {
    console.error('Error fetching lab values:', error);
    return [];
  }

  return data || [];
}

// Get findings for an encounter
export async function getFindingsForEncounter(encounterId: string): Promise<Finding[]> {
  const { data, error } = await supabase
    .from('findings')
    .select('*')
    .eq('encounter_id', encounterId)
    .order('performed_at', { ascending: false });

  if (error) {
    console.error('Error fetching findings:', error);
    return [];
  }

  return data || [];
}

// Get encounter with all related details
export async function getEncounterWithDetails(encounterId: string): Promise<EncounterWithDetails | null> {
  const { data: encounter, error } = await supabase
    .from('encounters')
    .select('*')
    .eq('id', encounterId)
    .single();

  if (error || !encounter) {
    console.error('Error fetching encounter:', error);
    return null;
  }

  const [diagnoses, medications, labValues, findings] = await Promise.all([
    getDiagnosesForEncounter(encounterId),
    getMedicationsForEncounter(encounterId),
    getLabValuesForEncounter(encounterId),
    getFindingsForEncounter(encounterId),
  ]);

  return {
    ...encounter,
    diagnoses,
    medications,
    lab_values: labValues,
    findings,
  };
}

// Get all encounters with details for a case
export async function getEncountersWithDetailsForCase(caseId: string): Promise<EncounterWithDetails[]> {
  const encounters = await getEncountersForCase(caseId);

  const encountersWithDetails = await Promise.all(
    encounters.map(async (encounter) => {
      const [diagnoses, medications, labValues, findings] = await Promise.all([
        getDiagnosesForEncounter(encounter.id),
        getMedicationsForEncounter(encounter.id),
        getLabValuesForEncounter(encounter.id),
        getFindingsForEncounter(encounter.id),
      ]);

      return {
        ...encounter,
        diagnoses,
        medications,
        lab_values: labValues,
        findings,
      };
    })
  );

  return encountersWithDetails;
}

// Get complete case with all related data
export async function getCaseWithDetails(caseId: string): Promise<CaseWithDetails | null> {
  const caseData = await getCase(caseId);

  if (!caseData) {
    return null;
  }

  const [encounters, allDiagnoses, allMedications] = await Promise.all([
    getEncountersWithDetailsForCase(caseId),
    getDiagnosesForCase(caseId),
    getMedicationsForCase(caseId),
  ]);

  return {
    ...caseData,
    encounters,
    all_diagnoses: allDiagnoses,
    all_medications: allMedications,
  };
}

// Get chronic conditions (diagnoses with status 'chronic')
export async function getChronicConditionsForCase(caseId: string): Promise<Diagnosis[]> {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('case_id', caseId)
    .eq('diagnosis_status', 'chronic');

  if (error) {
    console.error('Error fetching chronic conditions:', error);
    return [];
  }

  return data || [];
}

// Get historical diagnoses (outside query period - older than 5 years)
export async function getHistoricalDiagnosesForCase(
  caseId: string,
  yearsBack: number = 5
): Promise<Diagnosis[]> {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsBack);
  const cutoffDateString = cutoffDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('case_id', caseId)
    .lt('diagnosed_date', cutoffDateString)
    .order('diagnosed_date', { ascending: false });

  if (error) {
    console.error('Error fetching historical diagnoses:', error);
    return [];
  }

  return data || [];
}

// Get current medications (is_current = true)
export async function getCurrentMedicationsForCase(caseId: string): Promise<Medication[]> {
  const { data, error } = await supabase
    .from('medications')
    .select('*')
    .eq('case_id', caseId)
    .eq('is_current', true);

  if (error) {
    console.error('Error fetching current medications:', error);
    return [];
  }

  return data || [];
}
