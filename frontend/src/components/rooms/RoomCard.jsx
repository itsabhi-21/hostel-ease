import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatEnumValue } from '@/lib/utils';

const statusColors = {
  AVAILABLE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
  OCCUPIED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
  MAINTENANCE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
  RESERVED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800',
};

export function RoomCard({ room, onClick, onDelete, onUpdate }) {
  const isFull = room.currentOccupancy >= room.capacity;
  const isAvailable = room.status === 'AVAILABLE' && !isFull;

  const handleStatusChange = (newStatus) => {
    if (onUpdate) {
      onUpdate(room.id, { status: newStatus });
    }
  };

  return (
    <Card 
      className="transition-all hover:shadow-lg"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <CardTitle className="text-xl">Room {room.roomNumber}</CardTitle>
          </div>
          <span className={cn(
            'px-2 py-1 text-xs font-semibold rounded border',
            statusColors[room.status]
          )}>
            {formatEnumValue(room.status)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Floor</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {room.floor}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Occupancy
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {room.currentOccupancy} / {room.capacity}
            </span>
          </div>

          {/* Occupancy bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all',
                isFull ? 'bg-red-500' : isAvailable ? 'bg-green-500' : 'bg-blue-500'
              )}
              style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
            />
          </div>

          {room.assignedStudents && room.assignedStudents.length > 0 && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Residents:</p>
              <div className="space-y-1">
                {room.assignedStudents.map((student) => (
                  <p key={student.id} className="text-xs text-gray-900 dark:text-gray-100">
                    {student.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {onUpdate && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Change Status:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant={room.status === 'AVAILABLE' ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange('AVAILABLE');
                  }}
                  className="text-xs"
                >
                  Available
                </Button>
                <Button
                  size="sm"
                  variant={room.status === 'MAINTENANCE' ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange('MAINTENANCE');
                  }}
                  className="text-xs"
                >
                  Maintenance
                </Button>
              </div>
            </div>
          )}

          {onDelete && (
            <div className="pt-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(room.id);
                }}
                className="w-full text-xs"
              >
                Delete Room
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
