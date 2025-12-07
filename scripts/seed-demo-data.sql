-- Demo Data Seed Script for Nathan Underwriting System
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ywnhcltxdogxmmbsfogn/sql

-- Generate UUIDs for relationships
DO $$
DECLARE
  case_id UUID := gen_random_uuid();
  encounter1_id UUID := gen_random_uuid();
  encounter2_id UUID := gen_random_uuid();
  encounter3_id UUID := gen_random_uuid();
BEGIN

-- 1. Create Demo Case
INSERT INTO underwriting_cases (id, status, name, birth_date, gender, height, weight, smoker_status, annual_income, occupation, hobbies)
VALUES (
  case_id,
  'review',
  'Max Mustermann',
  '1989-05-15',
  'male',
  183,
  82,
  false,
  75000,
  '{"title": "Softwareentwickler", "type": "Angestellter", "risk_level": "low", "physical_demands": ["Sitzende Tätigkeit", "Bildschirmarbeit"], "work_environment": ["Büro", "Home Office"]}'::jsonb,
  '[{"name": "Tauchen", "frequency": "2-3x pro Monat", "risk_level": "high"}, {"name": "Klettern", "frequency": "wöchentlich", "risk_level": "medium"}, {"name": "Jogging", "frequency": "2x pro Woche", "risk_level": "low"}, {"name": "Radfahren", "frequency": "regelmäßig", "risk_level": "low"}]'::jsonb
);

RAISE NOTICE 'Created case: %', case_id;

-- 2. Create Encounters
INSERT INTO encounters (id, case_id, title, encounter_type, start_date, end_date, facility, department, physician, source_document, anamnese, therapy_notes, discharge_summary)
VALUES
  (encounter1_id, case_id, 'Stationäre Behandlung wegen Ulkus', 'inpatient', '2023-03-12', '2023-03-18', 'Universitätsklinikum Hamburg', 'Gastroenterologie', 'Dr. med. Sarah Weber', 'Entlassungsbericht_UKE_032023.pdf', 'Patient stellt sich mit seit 2 Wochen bestehenden epigastrischen Schmerzen vor, verstärkt nach Nahrungsaufnahme. Keine Übelkeit, kein Erbrechen. Gewichtsverlust von ca. 3 kg in den letzten 4 Wochen.', 'Eradikationstherapie mit PPI + Amoxicillin + Clarithromycin über 14 Tage. Protonenpumpenhemmer-Dauertherapie für 8 Wochen empfohlen.', 'Erfolgreiche Behandlung des Ulcus duodeni. Patient beschwerdefrei bei Entlassung. Kontrolle der Eradikation in 4 Wochen empfohlen.'),
  (encounter2_id, case_id, 'Kontrolluntersuchung Diabetes', 'outpatient', '2023-09-15', NULL, 'Diabetologische Schwerpunktpraxis Dr. Meier', 'Diabetologie', 'Dr. med. Klaus Meier', 'Arztbrief_Diabetologie_092023.pdf', 'Routinekontrolle bei bekanntem Diabetes mellitus Typ 2. Patient berichtet über gute Blutzuckereinstellung unter aktueller Medikation.', 'Metformin-Therapie fortsetzen. Lebensstilmodifikation empfohlen.', NULL),
  (encounter3_id, case_id, 'MRT Lendenwirbelsäule', 'imaging', '2020-06-22', NULL, 'Radiologisches Zentrum Hamburg', 'Radiologie', 'Dr. med. Anna Schmidt', 'MRT_Befund_LWS_062020.pdf', 'Anhaltende Rückenschmerzen seit 3 Monaten, Ausstrahlung ins linke Bein.', NULL, NULL);

RAISE NOTICE 'Created 3 encounters';

-- 3. Create Diagnoses
INSERT INTO diagnoses (case_id, encounter_id, condition, icd10_code, icd10_description, diagnosis_type, diagnosis_status, diagnosed_date, confidence, needs_review)
VALUES
  -- Encounter 1 - Ulkus
  (case_id, encounter1_id, 'Ulcus duodeni', 'K26.3', 'Ulcus duodeni, akut, ohne Blutung oder Perforation', 'primary', 'resolved', '2023-03-12', 0.95, false),
  (case_id, encounter1_id, 'Helicobacter pylori Infektion', 'B96.81', 'Helicobacter pylori als Ursache von Krankheiten', 'secondary', 'resolved', '2023-03-13', 0.98, false),
  -- Encounter 2 - Diabetes
  (case_id, encounter2_id, 'Diabetes mellitus Typ 2', 'E11.9', 'Diabetes mellitus Typ 2 ohne Komplikationen', 'primary', 'chronic', '2015-08-20', 1.0, false),
  -- Encounter 3 - Bandscheibe
  (case_id, encounter3_id, 'Bandscheibenvorfall LWS', 'M51.1', 'Lumbale und sonstige Bandscheibenschäden mit Radikulopathie', 'primary', 'resolved', '2020-06-22', 0.92, false),
  -- Historical diagnosis (no encounter)
  (case_id, NULL, 'Malignes Melanom', 'C43.9', 'Bösartiges Melanom der Haut, nicht näher bezeichnet', 'primary', 'resolved', '2018-04-15', 1.0, true);

RAISE NOTICE 'Created 5 diagnoses';

-- 4. Create Medications
INSERT INTO medications (case_id, encounter_id, name, brand_name, dosage, dosage_value, dosage_unit, frequency, route, indication, start_date, end_date, is_current, as_needed)
VALUES
  -- Ulkus Behandlung
  (case_id, encounter1_id, 'Pantoprazol', 'Pantozol', '40 mg', 40, 'mg', '2-0-2', 'oral', 'Eradikationstherapie', '2023-03-12', '2023-05-12', false, false),
  (case_id, encounter1_id, 'Amoxicillin', 'Amoxicillin-ratiopharm', '1000 mg', 1000, 'mg', '1-0-1', 'oral', 'Eradikationstherapie', '2023-03-12', '2023-03-26', false, false),
  (case_id, encounter1_id, 'Clarithromycin', 'Klacid', '500 mg', 500, 'mg', '1-0-1', 'oral', 'Eradikationstherapie', '2023-03-12', '2023-03-26', false, false),
  -- Diabetes Medikation (aktuell)
  (case_id, encounter2_id, 'Metformin', 'Glucophage', '850 mg', 850, 'mg', '1-0-1', 'oral', 'Diabetes mellitus Typ 2', '2015-09-01', NULL, true, false);

RAISE NOTICE 'Created 4 medications';

-- 5. Create Lab Values
INSERT INTO lab_values (case_id, encounter_id, parameter, value, unit, reference_range, reference_low, reference_high, is_abnormal, abnormality_direction, measured_date)
VALUES
  -- Encounter 1 - Ulkus
  (case_id, encounter1_id, 'Hämoglobin', 12.8, 'g/dl', '13.5-17.5', 13.5, 17.5, true, 'low', '2023-03-12'),
  (case_id, encounter1_id, 'CRP', 15, 'mg/l', '<5', 0, 5, true, 'high', '2023-03-12'),
  (case_id, encounter1_id, 'Kreatinin', 0.9, 'mg/dl', '0.7-1.2', 0.7, 1.2, false, NULL, '2023-03-12'),
  (case_id, encounter1_id, 'Leukozyten', 11.2, 'G/l', '4.0-10.0', 4.0, 10.0, true, 'high', '2023-03-12'),
  -- Encounter 2 - Diabetes
  (case_id, encounter2_id, 'HbA1c', 6.8, '%', '<6.5', 4.0, 6.5, true, 'high', '2023-09-15'),
  (case_id, encounter2_id, 'Nüchtern-Glukose', 118, 'mg/dl', '70-100', 70, 100, true, 'high', '2023-09-15'),
  (case_id, encounter2_id, 'Kreatinin', 0.95, 'mg/dl', '0.7-1.2', 0.7, 1.2, false, NULL, '2023-09-15');

RAISE NOTICE 'Created 7 lab values';

-- 6. Create Findings
INSERT INTO findings (case_id, encounter_id, finding_type, title, description, result_summary, result_category, performed_at)
VALUES
  (case_id, encounter1_id, 'Gastroskopie', 'Ösophago-Gastro-Duodenoskopie', 'Untersuchung des oberen Gastrointestinaltrakts', 'Florides großes Ulkus im Bulbus duodeni (ca. 1,5 cm). Refluxösophagitis Grad D nach Los-Angeles-Klassifikation. Antrumgastritis.', 'pathological', '2023-03-13'),
  (case_id, encounter1_id, 'Sonografie', 'Abdomen-Sonografie', 'Ultraschalluntersuchung des Abdomens', 'Leber, Gallenblase und Pankreas unauffällig. Nieren beidseits normal groß. Retentionsmagen als Hinweis auf gestörte Magenentleerung.', 'abnormal', '2023-03-12'),
  (case_id, encounter3_id, 'MRT', 'MRT der Lendenwirbelsäule', 'Magnetresonanztomografie LWS nativ', 'Bandscheibenvorfall L4/L5 links mit Kontakt zur Nervenwurzel L5. Mäßige Degeneration der Bandscheiben L3-S1. Keine spinale Enge.', 'pathological', '2020-06-22');

RAISE NOTICE 'Created 3 findings';

-- Output the case ID for reference
RAISE NOTICE '✅ Demo data created successfully! Case ID: %', case_id;

END $$;

-- Show the created case
SELECT id, name, status, birth_date FROM underwriting_cases ORDER BY created_at DESC LIMIT 1;
