import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ErrorMessage({ message, onDismiss, className }) {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export function ErrorPage({ title = 'Error', message, onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
