'use client';

import { useState } from 'react';
import { ComplaintCard } from './ComplaintCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { MessageSquare } from 'lucide-react';
import { COMPLAINT_STATUS, COMPLAINT_CATEGORIES } from '@/constants/apiEndpoints';

export function ComplaintList({ complaints, role, onComplaintClick, onStatusChange, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
  });

  // Filter and sort complaints
  const filteredComplaints = complaints
    .filter((complaint) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !complaint.title.toLowerCase().includes(search) &&
          !complaint.description.toLowerCase().includes(search) &&
          !complaint.studentName.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status && complaint.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category && complaint.category !== filters.category) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by status priority (PENDING first) then by date
      const statusPriority = { PENDING: 0, IN_PROGRESS: 1, RESOLVED: 2, REJECTED: 3 };
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search complaints..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All Statuses</option>
                <option value={COMPLAINT_STATUS.PENDING}>Pending</option>
                <option value={COMPLAINT_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={COMPLAINT_STATUS.RESOLVED}>Resolved</option>
                <option value={COMPLAINT_STATUS.REJECTED}>Rejected</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All Categories</option>
                <option value={COMPLAINT_CATEGORIES.MAINTENANCE}>Maintenance</option>
                <option value={COMPLAINT_CATEGORIES.CLEANLINESS}>Cleanliness</option>
                <option value={COMPLAINT_CATEGORIES.FOOD}>Food</option>
                <option value={COMPLAINT_CATEGORIES.SECURITY}>Security</option>
                <option value={COMPLAINT_CATEGORIES.OTHER}>Other</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilters({ status: '', category: '' });
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredComplaints.length} of {complaints.length} complaints
      </div>

      {/* Complaints Grid */}
      {filteredComplaints.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onStatusChange={onStatusChange ? (status) => onStatusChange(complaint.id, status) : null}
              onClick={() => onComplaintClick && onComplaintClick(complaint.id)}
              onDelete={onDelete ? () => onDelete(complaint.id) : null}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No complaints found"
          description="Try adjusting your search or filters to find complaints."
        />
      )}
    </div>
  );
}
