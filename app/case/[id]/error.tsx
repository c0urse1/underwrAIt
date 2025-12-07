'use client';

import { useEffect } from 'react';
import { FileWarning, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CaseError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Case Page Error:', error);
  }, [error]);

  // Check if it's a "not found" type error
  const isNotFound = error.message.toLowerCase().includes('not found') ||
                     error.message.toLowerCase().includes('nicht gefunden');

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isNotFound ? 'bg-amber-100' : 'bg-red-100'
        }`}>
          <FileWarning className={`w-8 h-8 ${
            isNotFound ? 'text-amber-600' : 'text-red-600'
          }`} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isNotFound ? 'Fall nicht gefunden' : 'Fehler beim Laden des Falls'}
        </h1>

        <p className="text-gray-500 mb-6">
          {isNotFound
            ? 'Der angeforderte Underwriting-Fall existiert nicht oder wurde entfernt.'
            : 'Beim Laden der Falldaten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
          }
        </p>

        {process.env.NODE_ENV === 'development' && !isNotFound && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-medium text-red-800 mb-1">
              Fehlerdetails:
            </p>
            <p className="text-sm text-red-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isNotFound && (
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Erneut versuchen
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </div>
  );
}
