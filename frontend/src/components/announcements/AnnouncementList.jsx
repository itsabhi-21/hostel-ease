'use client';

import { AnnouncementCard } from './AnnouncementCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Megaphone } from 'lucide-react';

export function AnnouncementList({ announcements, role, onMarkRead }) {
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const priorityOrder = { URGENT: 0, IMPORTANT: 1, NORMAL: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-4">
      {sortedAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onMarkRead={role === 'STUDENT' ? onMarkRead : null}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Megaphone}
          title="No announcements"
          description="There are no announcements at this time."
        />
      )}
    </div>
  );
}
