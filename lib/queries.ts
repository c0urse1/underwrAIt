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
import {
  DatabaseError,
  NotFoundError,
  logError,
  ValidationError,
} from './errors';

// Helper function to handle Supabase errors
function handleSupabaseError(
  error: { message: string; code?: string; details?: string } | null,
  operation: string,
  context?: Record<string, unknown>
): void {
  if (error) {
    logError(error, { operation, ...context });
    throw new DatabaseError(`${operation}: ${error.message}`);
  }
}

// Validate UUID format
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Validate case ID
function validateCaseId(caseId: string): void {
  if (!caseId || caseId.trim() === '') {
    throw new ValidationError('Fall-ID ist erforderlich', 'caseId');
  }
  if (!isValidUUID(caseId)) {
    throw new ValidationError('Ungültige Fall-ID Format', 'caseId');
  }
}

// Get a single case by ID
export async function getCase(caseId: string): Promise<UnderwritingCase | null> {
  validateCaseId(caseId);

  try {
    const { data, error } = await supabase
      .from('underwriting_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (error) {
      // PGRST116 means no rows returned - this is a "not found" case
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error, 'Fall abrufen', { caseId });
    }

    return data;
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getCase', caseId });
    throw new DatabaseError('Fehler beim Abrufen des Falls');
  }
}

// Get all cases
export async function getAllCases(): Promise<UnderwritingCase[]> {
  // Debug: Check if Supabase is configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('[getAllCases] Missing Supabase config:', {
      hasUrl: !!url,
      hasKey: !!key,
    });
    throw new DatabaseError('Supabase Konfiguration fehlt');
  }

  try {
    console.log('[getAllCases] Fetching cases from Supabase...');

    const { data, error } = await supabase
      .from('underwriting_cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getAllCases] Supabase error:', error);
      handleSupabaseError(error, 'Alle Fälle abrufen');
    }

    console.log('[getAllCases] Fetched cases:', data?.length ?? 0);
    return data || [];
  } catch (error) {
    console.error('[getAllCases] Caught error:', error);
    logError(error, { operation: 'getAllCases' });
    throw new DatabaseError('Fehler beim Abrufen der Fälle');
  }
}

// Get encounters for a case
export async function getEncountersForCase(caseId: string): Promise<Encounter[]> {
  validateCaseId(caseId);

  try {
    const { data, error } = await supabase
      .from('encounters')
      .select('*')
      .eq('case_id', caseId)
      .order('start_date', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'Behandlungsepisoden abrufen', { caseId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getEncountersForCase', caseId });
    throw new DatabaseError('Fehler beim Abrufen der Behandlungsepisoden');
  }
}

// Get all encounters (when no case filter is needed)
export async function getAllEncounters(): Promise<Encounter[]> {
  try {
    const { data, error } = await supabase
      .from('encounters')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'Alle Behandlungsepisoden abrufen');
    }

    return data || [];
  } catch (error) {
    logError(error, { operation: 'getAllEncounters' });
    throw new DatabaseError('Fehler beim Abrufen der Behandlungsepisoden');
  }
}

// Get diagnoses for an encounter
export async function getDiagnosesForEncounter(encounterId: string): Promise<Diagnosis[]> {
  if (!encounterId || encounterId.trim() === '') {
    throw new ValidationError('Encounter-ID ist erforderlich', 'encounterId');
  }

  try {
    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('encounter_id', encounterId)
      .order('diagnosis_type', { ascending: true });

    if (error) {
      handleSupabaseError(error, 'Diagnosen abrufen', { encounterId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getDiagnosesForEncounter', encounterId });
    throw new DatabaseError('Fehler beim Abrufen der Diagnosen');
  }
}

// Get all diagnoses for a case
export async function getDiagnosesForCase(caseId: string): Promise<Diagnosis[]> {
  validateCaseId(caseId);

  try {
    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('case_id', caseId)
      .order('diagnosed_date', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'Fall-Diagnosen abrufen', { caseId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getDiagnosesForCase', caseId });
    throw new DatabaseError('Fehler beim Abrufen der Diagnosen');
  }
}

// Get medications for an encounter
export async function getMedicationsForEncounter(encounterId: string): Promise<Medication[]> {
  if (!encounterId || encounterId.trim() === '') {
    throw new ValidationError('Encounter-ID ist erforderlich', 'encounterId');
  }

  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('encounter_id', encounterId);

    if (error) {
      handleSupabaseError(error, 'Medikamente abrufen', { encounterId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getMedicationsForEncounter', encounterId });
    throw new DatabaseError('Fehler beim Abrufen der Medikamente');
  }
}

// Get all medications for a case
export async function getMedicationsForCase(caseId: string): Promise<Medication[]> {
  validateCaseId(caseId);

  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('case_id', caseId)
      .order('start_date', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'Fall-Medikamente abrufen', { caseId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getMedicationsForCase', caseId });
    throw new DatabaseError('Fehler beim Abrufen der Medikamente');
  }
}

// Get lab values for an encounter
export async function getLabValuesForEncounter(encounterId: string): Promise<LabValue[]> {
  if (!encounterId || encounterId.trim() === '') {
    throw new ValidationError('Encounter-ID ist erforderlich', 'encounterId');
  }

  try {
    const { data, error } = await supabase
      .from('lab_values')
      .select('*')
      .eq('encounter_id', encounterId)
      .order('measured_date', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'Laborwerte abrufen', { encounterId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getLabValuesForEncounter', encounterId });
    throw new DatabaseError('Fehler beim Abrufen der Laborwerte');
  }
}

// Get findings for an encounter
export async function getFindingsForEncounter(encounterId: string): Promise<Finding[]> {
  if (!encounterId || encounterId.trim() === '') {
    throw new ValidationError('Encounter-ID ist erforderlich', 'encounterId');
  }

  try {
    const { data, error } = await supabase
      .from('findings')
      .select('*')
      .eq('encounter_id', encounterId)
      .order('performed_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'Befunde abrufen', { encounterId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getFindingsForEncounter', encounterId });
    throw new DatabaseError('Fehler beim Abrufen der Befunde');
  }
}

// Get encounter with all related details
export async function getEncounterWithDetails(encounterId: string): Promise<EncounterWithDetails | null> {
  if (!encounterId || encounterId.trim() === '') {
    throw new ValidationError('Encounter-ID ist erforderlich', 'encounterId');
  }

  try {
    const { data: encounter, error } = await supabase
      .from('encounters')
      .select('*')
      .eq('id', encounterId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error, 'Behandlungsepisode abrufen', { encounterId });
    }

    if (!encounter) {
      return null;
    }

    // Fetch all related data in parallel with error handling
    const [diagnoses, medications, labValues, findings] = await Promise.allSettled([
      getDiagnosesForEncounter(encounterId),
      getMedicationsForEncounter(encounterId),
      getLabValuesForEncounter(encounterId),
      getFindingsForEncounter(encounterId),
    ]);

    return {
      ...encounter,
      diagnoses: diagnoses.status === 'fulfilled' ? diagnoses.value : [],
      medications: medications.status === 'fulfilled' ? medications.value : [],
      lab_values: labValues.status === 'fulfilled' ? labValues.value : [],
      findings: findings.status === 'fulfilled' ? findings.value : [],
    };
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getEncounterWithDetails', encounterId });
    throw new DatabaseError('Fehler beim Abrufen der Behandlungsepisode');
  }
}

// Get all encounters with details for a case
export async function getEncountersWithDetailsForCase(caseId: string): Promise<EncounterWithDetails[]> {
  validateCaseId(caseId);

  try {
    const encounters = await getEncountersForCase(caseId);

    if (encounters.length === 0) {
      return [];
    }

    const encountersWithDetails = await Promise.allSettled(
      encounters.map(async (encounter) => {
        const [diagnoses, medications, labValues, findings] = await Promise.allSettled([
          getDiagnosesForEncounter(encounter.id),
          getMedicationsForEncounter(encounter.id),
          getLabValuesForEncounter(encounter.id),
          getFindingsForEncounter(encounter.id),
        ]);

        return {
          ...encounter,
          diagnoses: diagnoses.status === 'fulfilled' ? diagnoses.value : [],
          medications: medications.status === 'fulfilled' ? medications.value : [],
          lab_values: labValues.status === 'fulfilled' ? labValues.value : [],
          findings: findings.status === 'fulfilled' ? findings.value : [],
        };
      })
    );

    // Filter out failed promises and return successful results
    return encountersWithDetails
      .filter((result): result is PromiseFulfilledResult<EncounterWithDetails> =>
        result.status === 'fulfilled'
      )
      .map((result) => result.value);
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getEncountersWithDetailsForCase', caseId });
    throw new DatabaseError('Fehler beim Abrufen der Behandlungsepisoden');
  }
}

// Get complete case with all related data
export async function getCaseWithDetails(caseId: string): Promise<CaseWithDetails | null> {
  validateCaseId(caseId);

  try {
    const caseData = await getCase(caseId);

    if (!caseData) {
      return null;
    }

    // Fetch all related data in parallel with error handling
    const [encountersResult, diagnosesResult, medicationsResult] = await Promise.allSettled([
      getEncountersWithDetailsForCase(caseId),
      getDiagnosesForCase(caseId),
      getMedicationsForCase(caseId),
    ]);

    return {
      ...caseData,
      encounters: encountersResult.status === 'fulfilled' ? encountersResult.value : [],
      all_diagnoses: diagnosesResult.status === 'fulfilled' ? diagnosesResult.value : [],
      all_medications: medicationsResult.status === 'fulfilled' ? medicationsResult.value : [],
    };
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getCaseWithDetails', caseId });
    throw new DatabaseError('Fehler beim Abrufen der Falldaten');
  }
}

// Get chronic conditions (diagnoses with status 'chronic')
export async function getChronicConditionsForCase(caseId: string): Promise<Diagnosis[]> {
  validateCaseId(caseId);

  try {
    const { data, error } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('case_id', caseId)
      .eq('diagnosis_status', 'chronic');

    if (error) {
      handleSupabaseError(error, 'Chronische Erkrankungen abrufen', { caseId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getChronicConditionsForCase', caseId });
    throw new DatabaseError('Fehler beim Abrufen der chronischen Erkrankungen');
  }
}

// Get historical diagnoses (outside query period - older than 5 years)
export async function getHistoricalDiagnosesForCase(
  caseId: string,
  yearsBack: number = 5
): Promise<Diagnosis[]> {
  validateCaseId(caseId);

  if (yearsBack < 0 || yearsBack > 100) {
    throw new ValidationError('Ungültiger Zeitraum', 'yearsBack');
  }

  try {
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
      handleSupabaseError(error, 'Historische Diagnosen abrufen', { caseId, yearsBack });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getHistoricalDiagnosesForCase', caseId, yearsBack });
    throw new DatabaseError('Fehler beim Abrufen der historischen Diagnosen');
  }
}

// Get current medications (is_current = true)
export async function getCurrentMedicationsForCase(caseId: string): Promise<Medication[]> {
  validateCaseId(caseId);

  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('case_id', caseId)
      .eq('is_current', true);

    if (error) {
      handleSupabaseError(error, 'Aktuelle Medikamente abrufen', { caseId });
    }

    return data || [];
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    logError(error, { operation: 'getCurrentMedicationsForCase', caseId });
    throw new DatabaseError('Fehler beim Abrufen der aktuellen Medikamente');
  }
}
