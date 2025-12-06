// Database Types for Nathan Underwriting System

export interface Encounter {
  id: string;
  case_id: string | null;
  created_at: string;
  title: string | null;
  encounter_type: 'inpatient' | 'outpatient' | 'lab' | 'imaging';
  start_date: string | null;
  end_date: string | null;
  facility: string | null;
  department: string | null;
  physician: string | null;
  source_document: string | null;
  anamnese: string | null;
  therapy_notes: string | null;
  discharge_summary: string | null;
}

export interface Diagnosis {
  id: string;
  case_id: string | null;
  encounter_id: string | null;
  created_at: string;
  condition: string;
  icd10_code: string | null;
  icd10_description: string | null;
  diagnosis_type: 'primary' | 'secondary';
  diagnosis_status: 'active' | 'resolved' | 'chronic' | 'suspected';
  diagnosed_date: string | null;
  confidence: number | null;
  needs_review: boolean;
  source: string | null;
  extracted_from_document: string | null;
  parent_id: string | null;
  risk_category: string | null;
  risk_score: number | null;
}

export interface Medication {
  id: string;
  case_id: string | null;
  encounter_id: string | null;
  created_at: string;
  name: string;
  brand_name: string | null;
  dosage: string | null;
  dosage_value: number | null;
  dosage_unit: string | null;
  frequency: string | null;
  route: string | null;
  indication: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  as_needed: boolean;
}

export interface LabValue {
  id: string;
  case_id: string | null;
  encounter_id: string | null;
  created_at: string;
  parameter: string;
  value: number | null;
  value_text: string | null;
  unit: string | null;
  reference_range: string | null;
  reference_low: number | null;
  reference_high: number | null;
  is_abnormal: boolean | null;
  abnormality_direction: 'high' | 'low' | 'critical_high' | 'critical_low' | null;
  measured_date: string | null;
}

export interface Finding {
  id: string;
  case_id: string | null;
  encounter_id: string | null;
  created_at: string;
  finding_type: string | null;
  title: string | null;
  description: string | null;
  result_summary: string | null;
  result_category: 'normal' | 'abnormal' | 'pathological' | 'inconclusive' | null;
  performed_at: string | null;
}

export interface OccupationData {
  title?: string;
  type?: string;
  risk_level?: string;
  physical_demands?: string[];
  work_environment?: string[];
}

export interface HobbyData {
  name: string;
  frequency?: string;
  risk_level?: 'low' | 'medium' | 'high';
}

export interface UnderwritingCase {
  id: string;
  created_at: string;
  session_id: string | null;
  status: 'collecting' | 'review' | 'complete' | 'rejected';
  name: string | null;
  birth_date: string | null;
  gender: 'male' | 'female' | 'diverse' | null;
  height: number | null;
  weight: number | null;
  occupation: OccupationData | null;
  hobbies: HobbyData[] | null;
  smoker_status: boolean | null;
  annual_income: number | null;
}

// Extended types with related data
export interface EncounterWithDetails extends Encounter {
  diagnoses: Diagnosis[];
  medications: Medication[];
  lab_values: LabValue[];
  findings: Finding[];
}

export interface CaseWithDetails extends UnderwritingCase {
  encounters: EncounterWithDetails[];
  all_diagnoses: Diagnosis[];
  all_medications: Medication[];
}

// UI Helper Types
export type LabValueStatus = 'normal' | 'warning' | 'high' | 'low' | 'critical';

export interface EncounterTypeInfo {
  label: string;
  icon: string;
  color: string;
}

export interface DiagnosisTypeInfo {
  label: string;
  priority: number;
}
