'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'inpatient'
  | 'outpatient'
  | 'lab'
  | 'imaging'
  | 'active'
  | 'resolved'
  | 'chronic'
  | 'suspected';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  inpatient: 'bg-purple-100 text-purple-800 border-purple-200',
  outpatient: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  lab: 'bg-orange-100 text-orange-800 border-orange-200',
  imaging: 'bg-pink-100 text-pink-800 border-pink-200',
  active: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  chronic: 'bg-amber-100 text-amber-800 border-amber-200',
  suspected: 'bg-gray-100 text-gray-600 border-gray-200',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export function Badge({
  children,
  variant = 'default',
  className,
  size = 'sm'
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper function to get badge variant from encounter type
export function getEncounterBadgeVariant(encounterType: string): BadgeVariant {
  switch (encounterType) {
    case 'inpatient':
      return 'inpatient';
    case 'outpatient':
      return 'outpatient';
    case 'lab':
      return 'lab';
    case 'imaging':
      return 'imaging';
    default:
      return 'default';
  }
}

// Helper function to get badge variant from diagnosis status
export function getDiagnosisStatusBadgeVariant(status: string): BadgeVariant {
  switch (status) {
    case 'active':
      return 'active';
    case 'resolved':
      return 'resolved';
    case 'chronic':
      return 'chronic';
    case 'suspected':
      return 'suspected';
    default:
      return 'default';
  }
}

// Helper function to get German label for diagnosis status
export function getDiagnosisStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Aktiv',
    resolved: 'Behoben',
    chronic: 'Chronisch',
    suspected: 'Verdacht',
  };
  return labels[status] || status;
}
