import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function DashboardCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  onClick, 
  className 
}) {
  const isClickable = !!onClick;

  const CardWrapper = isClickable ? 'button' : 'div';

  return (
    <CardWrapper
      onClick={onClick}
      className={cn(
        'w-full text-left',
        isClickable && 'cursor-pointer transition-transform hover:scale-105 active:scale-100',
        className
      )}
    >
      <Card className={cn(
        'h-full shadow-md',
        isClickable && 'hover:shadow-xl transition-all hover:border-blue-300 dark:hover:border-blue-700'
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6">
          <CardTitle className="text-base font-semibold text-gray-600 dark:text-gray-400">
            {title}
          </CardTitle>
          {Icon && (
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          )}
        </CardHeader>
        <CardContent className="pb-6">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {value}
          </div>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
