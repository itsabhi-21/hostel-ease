import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComplaintStatusBadge } from './ComplaintStatusBadge';
import { MessageSquare, User, Home, Calendar } from 'lucide-react';
import { formatDateTime } from '@/lib/validators';
import { formatEnumValue } from '@/lib/utils';
import { useRole } from '@/hooks/useAuth';

export function ComplaintCard({ complaint, onStatusChange, onClick, onDelete }) {
  const { isStaff } = useRole();

  return (
    <Card 
      className="transition-all hover:shadow-lg"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {complaint.title}
            </CardTitle>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {complaint.studentName}
              </span>
              <span className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Room {complaint.roomNumber}
              </span>
            </div>
          </div>
          <ComplaintStatusBadge status={complaint.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {complaint.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDateTime(complaint.createdAt)}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
            {formatEnumValue(complaint.category)}
          </span>
        </div>

        {isStaff && complaint.status === 'PENDING' && onStatusChange && (
          <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange('IN_PROGRESS');
              }}
              className="flex-1"
            >
              Start Progress
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange('RESOLVED');
              }}
              className="flex-1"
            >
              Resolve
            </Button>
          </div>
        )}

        {onDelete && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="w-full"
            >
              Delete Complaint
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
