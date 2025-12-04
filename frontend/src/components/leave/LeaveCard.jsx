import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Home, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/validators';
import { useRole } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const statusColors = {
  PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
  APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
};

export function LeaveCard({ leave, onApprove, onReject }) {
  const { isStaff } = useRole();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{leave.studentName}</span>
              <Home className="h-4 w-4 ml-2" />
              <span>Room {leave.roomNumber}</span>
            </div>
          </div>
          <span className={cn('px-2 py-1 text-xs font-semibold rounded', statusColors[leave.status])}>
            {leave.status}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">From</p>
            <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(leave.startDate)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-1">To</p>
            <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(leave.endDate)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reason:</p>
          <p className="text-sm text-gray-900 dark:text-gray-100">{leave.reason}</p>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>{leave.destination}</span>
        </div>

        {leave.rejectionReason && (
          <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded">
            <p className="text-xs text-red-600 dark:text-red-400">Rejection Reason:</p>
            <p className="text-sm text-red-800 dark:text-red-200">{leave.rejectionReason}</p>
          </div>
        )}

        {isStaff && leave.status === 'PENDING' && (onApprove || onReject) && (
          <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {onReject && (
              <Button size="sm" variant="outline" onClick={() => onReject(leave.id)} className="flex-1">
                Reject
              </Button>
            )}
            {onApprove && (
              <Button size="sm" onClick={() => onApprove(leave.id)} className="flex-1">
                Approve
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
