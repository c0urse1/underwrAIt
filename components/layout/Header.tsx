import { formatDate } from '@/lib/utils';
import { FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  name?: string;
  caseNumber?: string;
  submittedDate?: string;
}

export function Header({ name, caseNumber, submittedDate }: HeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FileText className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">
                  BU-Dossier
                </h1>
                <span className="text-gray-400">•</span>
                <span className="text-xl font-semibold text-gray-700">
                  {name || 'Unbekannt'}
                </span>
                {caseNumber && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500 font-mono">
                      Fall #{caseNumber}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          {submittedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Eingereicht: {formatDate(submittedDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
