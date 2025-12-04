'use client';

import { useState } from 'react';
import { RoomCard } from './RoomCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { Home } from 'lucide-react';

export function RoomList({ rooms, onRoomClick, filters, onFilterChange, onDelete, onUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter((room) => {
    // Search filter
    if (searchTerm && !room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Floor filter
    if (filters.floor && room.floor !== parseInt(filters.floor)) {
      return false;
    }

    // Status filter
    if (filters.status && room.status !== filters.status) {
      return false;
    }

    // Availability filter
    if (filters.availability) {
      if (filters.availability === 'available') {
        return room.status === 'AVAILABLE' && room.currentOccupancy < room.capacity;
      } else if (filters.availability === 'occupied') {
        return room.currentOccupancy > 0;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="floor">Floor</Label>
              <select
                id="floor"
                value={filters.floor || ''}
                onChange={(e) => onFilterChange({ ...filters, floor: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All Floors</option>
                {[1, 2, 3, 4, 5].map((floor) => (
                  <option key={floor} value={floor}>
                    Floor {floor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filters.status || ''}
                onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RESERVED">Reserved</option>
              </select>
            </div>

            <div>
              <Label htmlFor="availability">Availability</Label>
              <select
                id="availability"
                value={filters.availability || ''}
                onChange={(e) => onFilterChange({ ...filters, availability: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All</option>
                <option value="available">Available Only</option>
                <option value="occupied">Occupied Only</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                onFilterChange({ floor: '', status: '', availability: '' });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredRooms.length} of {rooms.length} rooms
      </div>

      {/* Room Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => onRoomClick && onRoomClick(room.id)}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Home}
          title="No rooms found"
          description="Try adjusting your search or filters to find rooms."
        />
      )}
    </div>
  );
}
