import { Star, Globe, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GooglePresenceBadgeProps {
  reviewCount: number;
  rating: number;
  hasWebsite: boolean;
}

export function GooglePresenceBadge({ reviewCount, rating, hasWebsite }: GooglePresenceBadgeProps) {
  // Determine presence level
  let level: 'low' | 'medium' | 'high' = 'low';
  if (reviewCount > 50 || (hasWebsite && rating >= 4)) {
    level = 'high';
  } else if (reviewCount > 10 || hasWebsite) {
    level = 'medium';
  }

  const levelColors = {
    low: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-muted text-muted-foreground border-border',
  };

  const levelLabels = {
    low: 'Low Presence',
    medium: 'Medium',
    high: 'Strong',
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border',
          levelColors[level]
        )}
      >
        <MessageSquare className="w-3 h-3" />
        <span>{levelLabels[level]}</span>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-0.5">
          <MessageSquare className="w-3 h-3" />
          {reviewCount} reviews
        </span>
        {rating > 0 && (
          <span className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-warning text-warning" />
            {rating.toFixed(1)}
          </span>
        )}
        {hasWebsite ? (
          <Globe className="w-3 h-3 text-primary" />
        ) : (
          <Globe className="w-3 h-3 text-muted-foreground/40" />
        )}
      </div>
    </div>
  );
}
