// Demo Data Seed Script for Nathan Underwriting System
// Run with: npx ts-node scripts/seed-demo-data.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ywnhcltxdogxmmbsfogn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bmhjbHR4ZG9neG1tYnNmb2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzU2NTMsImV4cCI6MjA4MDMxMTY1M30.0NsQOTMvCZen4PrqliFpD5BT6YI2Vk4ElOJF4QKl0AQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDemoData() {
  console.log('🌱 Seeding demo data...\n');

  // 1. Create Demo Case
  const caseId = crypto.randomUUID();
  console.log('Creating case:', caseId);

  const { data: caseData, error: caseError } = await supabase
    .from('underwriting_cases')
    .insert({
      id: caseId,
      status: 'review',
      name: 'Max Mustermann',
      birth_date: '1989-05-15',
      gender: 'male',
      height: 183,
      weight: 82,
      smoker_status: false,
      annual_income: 75000,
      occupation: {
        title: 'Softwareentwickler',
        type: 'Angestellter',
        risk_level: 'low',
        physical_demands: ['Sitzende Tätigkeit', 'Bildschirmarbeit'],
        work_environment: ['Büro', 'Home Office']
      },
      hobbies: [
        { name: 'Tauchen', frequency: '2-3x pro Monat', risk_level: 'high' },
        { name: 'Klettern', frequency: 'wöchentlich', risk_level: 'medium' },
        { name: 'Jogging', frequency: '2x pro Woche', risk_level: 'low' },
        { name: 'Radfahren', frequency: 'regelmäßig', risk_level: 'low' }
      ]
    })
    .select()
    .single();

  if (caseError) {
    console.error('❌ Error creating case:', caseError);
    return;
  }
  console.log('✅ Case created:', caseData.name);

  // 2. Create Encounters
  const encounter1Id = crypto.randomUUID();
  const encounter2Id = crypto.randomUUID();
  const encounter3Id = crypto.randomUUID();

  const encounters = [
    {
      id: encounter1Id,
      case_id: caseId,
      title: 'Stationäre Behandlung wegen Ulkus',
      encounter_type: 'inpatient',
      start_date: '2023-03-12',
      end_date: '2023-03-18',
      facility: 'Universitätsklinikum Hamburg',
      department: 'Gastroenterologie',
      physician: 'Dr. med. Sarah Weber',
      source_document: 'Entlassungsbericht_UKE_032023.pdf',
      anamnese: 'Patient stellt sich mit seit 2 Wochen bestehenden epigastrischen Schmerzen vor, verstärkt nach Nahrungsaufnahme. Keine Übelkeit, kein Erbrechen. Gewichtsverlust von ca. 3 kg in den letzten 4 Wochen.',
      therapy_notes: 'Eradikationstherapie mit PPI + Amoxicillin + Clarithromycin über 14 Tage. Protonenpumpenhemmer-Dauertherapie für 8 Wochen empfohlen.',
      discharge_summary: 'Erfolgreiche Behandlung des Ulcus duodeni. Patient beschwerdefrei bei Entlassung. Kontrolle der Eradikation in 4 Wochen empfohlen.'
    },
    {
      id: encounter2Id,
      case_id: caseId,
      title: 'Kontrolluntersuchung Diabetes',
      encounter_type: 'outpatient',
      start_date: '2023-09-15',
      end_date: null,
      facility: 'Diabetologische Schwerpunktpraxis Dr. Meier',
      department: 'Diabetologie',
      physician: 'Dr. med. Klaus Meier',
      source_document: 'Arztbrief_Diabetologie_092023.pdf',
      anamnese: 'Routinekontrolle bei bekanntem Diabetes mellitus Typ 2. Patient berichtet über gute Blutzuckereinstellung unter aktueller Medikation.',
      therapy_notes: 'Metformin-Therapie fortsetzen. Lebensstilmodifikation empfohlen.',
      discharge_summary: null
    },
    {
      id: encounter3Id,
      case_id: caseId,
      title: 'MRT Lendenwirbelsäule',
      encounter_type: 'imaging',
      start_date: '2020-06-22',
      end_date: null,
      facility: 'Radiologisches Zentrum Hamburg',
      department: 'Radiologie',
      physician: 'Dr. med. Anna Schmidt',
      source_document: 'MRT_Befund_LWS_062020.pdf',
      anamnese: 'Anhaltende Rückenschmerzen seit 3 Monaten, Ausstrahlung ins linke Bein.',
      therapy_notes: null,
      discharge_summary: null
    }
  ];

  const { error: encountersError } = await supabase
    .from('encounters')
    .insert(encounters);

  if (encountersError) {
    console.error('❌ Error creating encounters:', encountersError);
    return;
  }
  console.log('✅ Encounters created:', encounters.length);

  // 3. Create Diagnoses
  const diagnoses = [
    // Encounter 1 - Ulkus
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      condition: 'Ulcus duodeni',
      icd10_code: 'K26.3',
      icd10_description: 'Ulcus duodeni, akut, ohne Blutung oder Perforation',
      diagnosis_type: 'primary',
      diagnosis_status: 'resolved',
      diagnosed_date: '2023-03-12',
      confidence: 0.95,
      needs_review: false
    },
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      condition: 'Helicobacter pylori Infektion',
      icd10_code: 'B96.81',
      icd10_description: 'Helicobacter pylori als Ursache von Krankheiten',
      diagnosis_type: 'secondary',
      diagnosis_status: 'resolved',
      diagnosed_date: '2023-03-13',
      confidence: 0.98,
      needs_review: false
    },
    // Encounter 2 - Diabetes
    {
      case_id: caseId,
      encounter_id: encounter2Id,
      condition: 'Diabetes mellitus Typ 2',
      icd10_code: 'E11.9',
      icd10_description: 'Diabetes mellitus Typ 2 ohne Komplikationen',
      diagnosis_type: 'primary',
      diagnosis_status: 'chronic',
      diagnosed_date: '2015-08-20',
      confidence: 1.0,
      needs_review: false
    },
    // Encounter 3 - Bandscheibe
    {
      case_id: caseId,
      encounter_id: encounter3Id,
      condition: 'Bandscheibenvorfall LWS',
      icd10_code: 'M51.1',
      icd10_description: 'Lumbale und sonstige Bandscheibenschäden mit Radikulopathie',
      diagnosis_type: 'primary',
      diagnosis_status: 'resolved',
      diagnosed_date: '2020-06-22',
      confidence: 0.92,
      needs_review: false
    },
    // Historical diagnosis
    {
      case_id: caseId,
      encounter_id: null,
      condition: 'Malignes Melanom',
      icd10_code: 'C43.9',
      icd10_description: 'Bösartiges Melanom der Haut, nicht näher bezeichnet',
      diagnosis_type: 'primary',
      diagnosis_status: 'resolved',
      diagnosed_date: '2018-04-15',
      confidence: 1.0,
      needs_review: true,
      risk_category: 'oncology',
      risk_score: 75
    }
  ];

  const { error: diagnosesError } = await supabase
    .from('diagnoses')
    .insert(diagnoses);

  if (diagnosesError) {
    console.error('❌ Error creating diagnoses:', diagnosesError);
    return;
  }
  console.log('✅ Diagnoses created:', diagnoses.length);

  // 4. Create Medications
  const medications = [
    // Ulkus Behandlung
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      name: 'Pantoprazol',
      brand_name: 'Pantozol',
      dosage: '40 mg',
      dosage_value: 40,
      dosage_unit: 'mg',
      frequency: '2-0-2',
      route: 'oral',
      indication: 'Eradikationstherapie',
      start_date: '2023-03-12',
      end_date: '2023-05-12',
      is_current: false,
      as_needed: false
    },
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      name: 'Amoxicillin',
      brand_name: 'Amoxicillin-ratiopharm',
      dosage: '1000 mg',
      dosage_value: 1000,
      dosage_unit: 'mg',
      frequency: '1-0-1',
      route: 'oral',
      indication: 'Eradikationstherapie',
      start_date: '2023-03-12',
      end_date: '2023-03-26',
      is_current: false,
      as_needed: false
    },
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      name: 'Clarithromycin',
      brand_name: 'Klacid',
      dosage: '500 mg',
      dosage_value: 500,
      dosage_unit: 'mg',
      frequency: '1-0-1',
      route: 'oral',
      indication: 'Eradikationstherapie',
      start_date: '2023-03-12',
      end_date: '2023-03-26',
      is_current: false,
      as_needed: false
    },
    // Diabetes Medikation (aktuell)
    {
      case_id: caseId,
      encounter_id: encounter2Id,
      name: 'Metformin',
      brand_name: 'Glucophage',
      dosage: '850 mg',
      dosage_value: 850,
      dosage_unit: 'mg',
      frequency: '1-0-1',
      route: 'oral',
      indication: 'Diabetes mellitus Typ 2',
      start_date: '2015-09-01',
      end_date: null,
      is_current: true,
      as_needed: false
    }
  ];

  const { error: medicationsError } = await supabase
    .from('medications')
    .insert(medications);

  if (medicationsError) {
    console.error('❌ Error creating medications:', medicationsError);
    return;
  }
  console.log('✅ Medications created:', medications.length);

  // 5. Create Lab Values
  const labValues = [
    // Encounter 1 - Ulkus
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      parameter: 'Hämoglobin',
      value: 12.8,
      unit: 'g/dl',
      reference_range: '13.5-17.5',
      reference_low: 13.5,
      reference_high: 17.5,
      is_abnormal: true,
      abnormality_direction: 'low',
      measured_date: '2023-03-12'
    },
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      parameter: 'CRP',
      value: 15,
      unit: 'mg/l',
      reference_range: '<5',
      reference_low: 0,
      reference_high: 5,
      is_abnormal: true,
      abnormality_direction: 'high',
      measured_date: '2023-03-12'
    },
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      parameter: 'Kreatinin',
      value: 0.9,
      unit: 'mg/dl',
      reference_range: '0.7-1.2',
      reference_low: 0.7,
      reference_high: 1.2,
      is_abnormal: false,
      abnormality_direction: null,
      measured_date: '2023-03-12'
    },
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      parameter: 'Leukozyten',
      value: 11.2,
      unit: 'G/l',
      reference_range: '4.0-10.0',
      reference_low: 4.0,
      reference_high: 10.0,
      is_abnormal: true,
      abnormality_direction: 'high',
      measured_date: '2023-03-12'
    },
    // Encounter 2 - Diabetes
    {
      case_id: caseId,
      encounter_id: encounter2Id,
      parameter: 'HbA1c',
      value: 6.8,
      unit: '%',
      reference_range: '<6.5',
      reference_low: 4.0,
      reference_high: 6.5,
      is_abnormal: true,
      abnormality_direction: 'high',
      measured_date: '2023-09-15'
    },
    {
      case_id: caseId,
      encounter_id: encounter2Id,
      parameter: 'Nüchtern-Glukose',
      value: 118,
      unit: 'mg/dl',
      reference_range: '70-100',
      reference_low: 70,
      reference_high: 100,
      is_abnormal: true,
      abnormality_direction: 'high',
      measured_date: '2023-09-15'
    },
    {
      case_id: caseId,
      encounter_id: encounter2Id,
      parameter: 'Kreatinin',
      value: 0.95,
      unit: 'mg/dl',
      reference_range: '0.7-1.2',
      reference_low: 0.7,
      reference_high: 1.2,
      is_abnormal: false,
      abnormality_direction: null,
      measured_date: '2023-09-15'
    }
  ];

  const { error: labValuesError } = await supabase
    .from('lab_values')
    .insert(labValues);

  if (labValuesError) {
    console.error('❌ Error creating lab values:', labValuesError);
    return;
  }
  console.log('✅ Lab values created:', labValues.length);

  // 6. Create Findings
  const findings = [
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      finding_type: 'Gastroskopie',
      title: 'Ösophago-Gastro-Duodenoskopie',
      description: 'Untersuchung des oberen Gastrointestinaltrakts',
      result_summary: 'Florides großes Ulkus im Bulbus duodeni (ca. 1,5 cm). Refluxösophagitis Grad D nach Los-Angeles-Klassifikation. Antrumgastritis.',
      result_category: 'pathological',
      performed_at: '2023-03-13'
    },
    {
      case_id: caseId,
      encounter_id: encounter1Id,
      finding_type: 'Sonografie',
      title: 'Abdomen-Sonografie',
      description: 'Ultraschalluntersuchung des Abdomens',
      result_summary: 'Leber, Gallenblase und Pankreas unauffällig. Nieren beidseits normal groß. Retentionsmagen als Hinweis auf gestörte Magenentleerung.',
      result_category: 'abnormal',
      performed_at: '2023-03-12'
    },
    {
      case_id: caseId,
      encounter_id: encounter3Id,
      finding_type: 'MRT',
      title: 'MRT der Lendenwirbelsäule',
      description: 'Magnetresonanztomografie LWS nativ',
      result_summary: 'Bandscheibenvorfall L4/L5 links mit Kontakt zur Nervenwurzel L5. Mäßige Degeneration der Bandscheiben L3-S1. Keine spinale Enge.',
      result_category: 'pathological',
      performed_at: '2020-06-22'
    }
  ];

  const { error: findingsError } = await supabase
    .from('findings')
    .insert(findings);

  if (findingsError) {
    console.error('❌ Error creating findings:', findingsError);
    return;
  }
  console.log('✅ Findings created:', findings.length);

  console.log('\n✨ Demo data seeded successfully!');
  console.log('📋 Case ID:', caseId);
  console.log('🔗 View at: /case/' + caseId);
}

seedDemoData().catch(console.error);
