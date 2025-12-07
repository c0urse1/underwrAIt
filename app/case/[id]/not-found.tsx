import { FileQuestion, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CaseNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Fall nicht gefunden
        </h1>

        <p className="text-gray-500 mb-6">
          Der angeforderte Underwriting-Fall existiert nicht oder wurde entfernt.
          Bitte überprüfen Sie die Fall-ID oder kehren Sie zur Übersicht zurück.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zur Fallübersicht
        </Link>
      </div>
    </div>
  );
}
