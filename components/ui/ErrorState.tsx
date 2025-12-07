import { AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorStateProps {
  title?: string;
  message: string;
  severity?: ErrorSeverity;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  compact?: boolean;
}

const severityStyles: Record<ErrorSeverity, { bg: string; border: string; text: string; icon: string }> = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: 'text-amber-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
};

export function ErrorState({
  title,
  message,
  severity = 'error',
  onRetry,
  retryLabel = 'Erneut versuchen',
  className = '',
  compact = false,
}: ErrorStateProps) {
  const styles = severityStyles[severity];
  const Icon = severity === 'warning' ? AlertTriangle : AlertCircle;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-2 ${styles.bg} ${styles.border} border rounded ${className}`}>
        <Icon className={`w-4 h-4 ${styles.icon} flex-shrink-0`} />
        <span className={`text-sm ${styles.text}`}>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`ml-auto text-sm font-medium ${styles.text} hover:underline flex items-center gap-1`}
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 ${styles.bg} ${styles.border} border rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-sm font-medium ${styles.text}`}>
              {title}
            </h3>
          )}
          <p className={`${title ? 'mt-1' : ''} text-sm ${styles.text} opacity-90`}>
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${styles.text} hover:underline`}
            >
              <RefreshCw className="w-4 h-4" />
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact inline error for form fields
export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-1.5 mt-1 text-sm text-red-600">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
}

export default ErrorState;
