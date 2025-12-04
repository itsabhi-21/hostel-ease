import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, AlertCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/validators';
import { cn } from '@/lib/utils';

const priorityStyles = {
  NORMAL: 'border-gray-200 dark:border-gray-700',
  IMPORTANT: 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10',
  URGENT: 'border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10',
};

const priorityBadges = {
  NORMAL: null,
  IMPORTANT: <span className="px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">Important</span>,
  URGENT: <span className="px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded flex items-center gap-1"><AlertCircle className="h-3 w-3" />Urgent</span>,
};

export function AnnouncementCard({ announcement, onMarkRead }) {
  const isRead = announcement.read;
  
  return (
    <Card className={cn('transition-all', priorityStyles[announcement.priority], isRead && 'opacity-75')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            {announcement.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isRead && (
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
                Read
              </span>
            )}
            {priorityBadges[announcement.priority]}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {announcement.content}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>By {announcement.createdByName}</span>
          <span>{formatDateTime(announcement.createdAt)}</span>
        </div>

        {onMarkRead && !isRead && (
          <Button size="sm" variant="outline" onClick={() => onMarkRead(announcement.id)} className="w-full">
            Mark as Read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
