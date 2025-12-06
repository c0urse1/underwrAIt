'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface DataRowProps {
  label: string;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function DataRow({
  label,
  value,
  className,
  labelClassName,
  valueClassName
}: DataRowProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className={cn('data-label', labelClassName)}>{label}</span>
      <span className={cn('data-value', valueClassName)}>{value}</span>
    </div>
  );
}

interface DataGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function DataGrid({ children, columns = 2, className }: DataGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {children}
    </div>
  );
}
