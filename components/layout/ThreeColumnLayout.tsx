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
    <div className="flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Mobile: Links + Mitte zusammen in einer Row */}
      <div className="flex flex-col md:flex-row xl:contents gap-6">
        {/* Linke Spalte - 300px auf Desktop, volle Breite auf Mobile */}
        <aside className="w-full md:w-[280px] xl:w-[300px] flex-shrink-0 space-y-4">
          {leftColumn}
        </aside>

        {/* Mittlere Spalte - Flexibel */}
        <main className="flex-1 min-w-0 order-first md:order-none">
          {middleColumn}
        </main>
      </div>

      {/* Rechte Spalte - 350px auf Desktop, volle Breite auf Mobile/Tablet */}
      <aside className="w-full xl:w-[350px] flex-shrink-0 space-y-4">
        {rightColumn}
      </aside>
    </div>
  );
}
