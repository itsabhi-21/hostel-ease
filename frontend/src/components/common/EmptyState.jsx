import { cn } from '@/lib/utils';

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}) {
  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && (
        <Icon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
