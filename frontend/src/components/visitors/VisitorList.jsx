'use client';

import { useState } from 'react';
import { VisitorCard } from './VisitorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';
import { Users } from 'lucide-react';

export function VisitorList({ visitors, role, onMarkExit }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVisitors = visitors.filter((visitor) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      visitor.visitorName.toLowerCase().includes(search) ||
      visitor.studentName.toLowerCase().includes(search) ||
      visitor.roomNumber.includes(search)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by visitor name, student, or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredVisitors.length} of {visitors.length} visitors
      </div>

      {filteredVisitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVisitors.map((visitor) => (
            <VisitorCard key={visitor.id} visitor={visitor} onMarkExit={onMarkExit} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Users} title="No visitors found" description="Try adjusting your search." />
      )}
    </div>
  );
}
