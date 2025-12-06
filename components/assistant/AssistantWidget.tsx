'use client';

import React, { useState } from 'react';
import { Bot, X, AlertTriangle, Send, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// TODO: Integration mit AI Agent in Phase 2
// Dieses Widget ist aktuell nur ein UI-Placeholder

interface AssistantWidgetProps {
  className?: string;
}

export function AssistantWidget({ className }: AssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Placeholder data - würde in Phase 2 vom AI Agent kommen
  const criticalPoints = [
    'Zusatzfragebogen Tauchen fehlt',
    'Zusatzfragebogen Klettern fehlt',
  ];

  if (!isOpen) {
    // Collapsed state - just a floating button
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-50',
          className
        )}
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 w-[380px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50',
        isMinimized && 'h-auto',
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Risikoprüfung Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform',
                isMinimized ? 'rotate-90' : '-rotate-90'
              )}
            />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content - collapsible */}
      {!isMinimized && (
        <>
          {/* Alert Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-full flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  Ich habe <span className="font-semibold">{criticalPoints.length} kritische Punkte</span> identifiziert:
                </p>
                <ul className="mt-2 space-y-1">
                  {criticalPoints.map((point, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Question */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm text-gray-700 mb-3">
              Soll ich einen Nachforderungsvorgang erstellen?
            </p>
            <div className="space-y-2">
              <button
                disabled
                className="w-full py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>Ja, Nachforderung erstellen</span>
              </button>
              <button
                disabled
                className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Später
              </button>
            </div>
            <button
              disabled
              className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Details anzeigen
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Input - Placeholder */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nachricht eingeben..."
                disabled
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                disabled
                className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400 text-center">
              Chat-Funktion wird in Phase 2 aktiviert
            </p>
          </div>
        </>
      )}
    </div>
  );
}
