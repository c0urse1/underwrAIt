'use client';

import { useState } from 'react';
import { Bot, X, MessageSquare, ChevronUp } from 'lucide-react';

export function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-200 ${
          isOpen
            ? 'bg-gray-700 hover:bg-gray-800'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Risikoprüfung Assistant</h3>
                <p className="text-sm text-blue-100">KI-gestützte Analyse</p>
              </div>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="p-6 min-h-[300px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">
              Phase 2 - Geplant
            </h4>
            <p className="text-sm text-gray-500 max-w-xs">
              Der KI-Assistent für die Risikoprüfung wird in einer späteren Phase implementiert.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Risikoanalyse
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Empfehlungen
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                Fragen & Antworten
              </span>
            </div>
          </div>

          {/* Input Placeholder */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Frage zur Risikoprüfung..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
              <button
                className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                disabled
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Verfügbar in Phase 2
            </p>
          </div>
        </div>
      )}
    </>
  );
}
