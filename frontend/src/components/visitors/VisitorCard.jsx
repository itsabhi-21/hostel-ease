import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User, Home, Calendar, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/validators';
import { useRole } from '@/hooks/useAuth';

export function VisitorCard({ visitor, onMarkExit }) {
  const { isStaff } = useRole();
  const isActive = !visitor.exitTime;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-4 w-4" />
            {visitor.visitorName}
          </CardTitle>
          {isActive && (
            <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
              Active
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>Visiting: {visitor.studentName}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Home className="h-4 w-4" />
            <span>Room {visitor.roomNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Entry: {formatDateTime(visitor.entryTime)}</span>
          </div>
          {visitor.exitTime && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Exit: {formatDateTime(visitor.exitTime)}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Purpose:</p>
          <p className="text-sm text-gray-900 dark:text-gray-100">{visitor.purpose}</p>
        </div>

        {isStaff && isActive && onMarkExit && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onMarkExit(visitor.id)}
            className="w-full"
          >
            Mark Exit
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
