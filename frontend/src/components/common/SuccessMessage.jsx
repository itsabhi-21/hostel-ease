'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SuccessMessage({ message, duration = 5000, onDismiss, className }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!message || !visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg',
        className
      )}
      role="status"
    >
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
        aria-label="Dismiss success message"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
