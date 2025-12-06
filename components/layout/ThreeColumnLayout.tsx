'use client';

import { ReactNode } from 'react';

interface ThreeColumnLayoutProps {
  leftColumn: ReactNode;
  middleColumn: ReactNode;
  rightColumn: ReactNode;
}

export function ThreeColumnLayout({
  leftColumn,
  middleColumn,
  rightColumn,
}: ThreeColumnLayoutProps) {
  return (
    <div className="flex gap-6 min-h-[calc(100vh-8rem)]">
      {/* Linke Spalte - 300px */}
      <aside className="w-[300px] flex-shrink-0 space-y-4">
        {leftColumn}
      </aside>

      {/* Mittlere Spalte - Flexibel */}
      <main className="flex-1 min-w-0">
        {middleColumn}
      </main>

      {/* Rechte Spalte - 350px */}
      <aside className="w-[350px] flex-shrink-0 space-y-4">
        {rightColumn}
      </aside>
    </div>
  );
}
