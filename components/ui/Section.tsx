'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Section({
  title,
  icon: Icon,
  children,
  className,
  headerAction
}: SectionProps) {
  return (
    <section className={cn('mb-6', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-header mb-0">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          {title}
        </h2>
        {headerAction}
      </div>
      {children}
    </section>
  );
}
