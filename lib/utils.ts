import { LabValue, LabValueStatus, EncounterTypeInfo, DiagnosisTypeInfo } from './types';

// Date formatting utilities
export function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateShort(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate) return '-';
  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  return `${formatDateShort(startDate)} - ${formatDate(endDate)}`;
}

// Calculate age from birth date
export function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Calculate BMI
export function calculateBMI(weight: number | null, height: number | null): number | null {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

// Lab value status determination
export function getLabValueStatus(labValue: LabValue): LabValueStatus {
  if (!labValue.is_abnormal) return 'normal';

  if (
    labValue.abnormality_direction === 'critical_high' ||
    labValue.abnormality_direction === 'critical_low'
  ) {
    return 'critical';
  }

  if (labValue.abnormality_direction === 'high') return 'high';
  if (labValue.abnormality_direction === 'low') return 'low';

  return 'warning';
}

export function getLabValueStatusLabel(status: LabValueStatus): string {
  const labels: Record<LabValueStatus, string> = {
    normal: 'normal',
    warning: 'grenzwertig',
    high: 'erhöht',
    low: 'niedrig',
    critical: 'kritisch',
  };
  return labels[status];
}

// Encounter type mapping
export const encounterTypeMap: Record<string, EncounterTypeInfo> = {
  inpatient: { label: 'Stationär', icon: '🏥', color: 'purple' },
  outpatient: { label: 'Ambulant', icon: '🏠', color: 'cyan' },
  lab: { label: 'Labor', icon: '🧪', color: 'orange' },
  imaging: { label: 'Bildgebung', icon: '📷', color: 'pink' },
};

export function getEncounterTypeInfo(type: string): EncounterTypeInfo {
  return encounterTypeMap[type] || { label: type, icon: '📋', color: 'gray' };
}

// Diagnosis type mapping
export const diagnosisTypeMap: Record<string, DiagnosisTypeInfo> = {
  primary: { label: 'Hauptdiagnose', priority: 1 },
  secondary: { label: 'Nebendiagnose', priority: 2 },
};

export function getDiagnosisTypeInfo(type: string): DiagnosisTypeInfo {
  return diagnosisTypeMap[type] || { label: type, priority: 3 };
}

// Smoker status formatting
export function formatSmokerStatus(status: boolean | null): string {
  if (status === null) return '-';
  return status ? 'Raucher' : 'Nichtraucher';
}

// Risk level colors
export function getRiskLevelColor(level: string | undefined): string {
  switch (level?.toLowerCase()) {
    case 'high':
    case 'hoch':
      return 'red';
    case 'medium':
    case 'mittel':
      return 'yellow';
    case 'low':
    case 'niedrig':
      return 'green';
    default:
      return 'gray';
  }
}

// Check if a date is within a query period (e.g., last 5 years)
export function isWithinQueryPeriod(
  dateString: string | null,
  yearsBack: number = 5
): boolean {
  if (!dateString) return true; // If no date, assume it's relevant
  const date = new Date(dateString);
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsBack);
  return date >= cutoffDate;
}

// Class name utility (simple cn function)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
