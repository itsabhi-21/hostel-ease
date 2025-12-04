'use client';

import { useState } from 'react';
import { LeaveCard } from './LeaveCard';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/common/EmptyState';
import { Calendar } from 'lucide-react';
import { LEAVE_STATUS } from '@/constants/apiEndpoints';

export function LeaveList({ leaves, role, onLeaveClick, onApprove, onReject }) {
  const [statusFilter, setStatusFilter] = useState('');

  const filteredLeaves = leaves
    .filter((leave) => !statusFilter || leave.status === statusFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Label htmlFor="status">Filter by Status:</Label>
        <select
          id="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="">All</option>
          <option value={LEAVE_STATUS.PENDING}>Pending</option>
          <option value={LEAVE_STATUS.APPROVED}>Approved</option>
          <option value={LEAVE_STATUS.REJECTED}>Rejected</option>
        </select>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredLeaves.length} of {leaves.length} applications
      </div>

      {filteredLeaves.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeaves.map((leave) => (
            <LeaveCard key={leave.id} leave={leave} onApprove={onApprove} onReject={onReject} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Calendar} title="No leave applications found" description="Try adjusting your filters." />
      )}
    </div>
  );
}
