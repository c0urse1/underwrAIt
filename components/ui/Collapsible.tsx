'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  badge?: ReactNode;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  contentClassName,
  badge,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-gray-200 rounded-lg bg-white', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors',
          isOpen && 'border-b border-gray-100',
          headerClassName
        )}
      >
        <div className="flex items-center gap-3">
          {title}
          {badge}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className={cn('p-4', contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}
