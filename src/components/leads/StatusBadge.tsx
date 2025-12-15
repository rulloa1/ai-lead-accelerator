import { Badge } from '@/components/ui/badge';
import { LeadStatus } from '@/types/lead';

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; variant: 'new' | 'contacted' | 'interested' | 'notInterested' | 'closed' }> = {
  'new': { label: 'New', variant: 'new' },
  'contacted': { label: 'Contacted', variant: 'contacted' },
  'interested': { label: 'Interested', variant: 'interested' },
  'not-interested': { label: 'Not Interested', variant: 'notInterested' },
  'closed': { label: 'Closed', variant: 'closed' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
