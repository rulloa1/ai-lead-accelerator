import { cn } from '@/lib/utils';

interface QualityScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function QualityScoreBadge({ score, size = 'md' }: QualityScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-success/10 text-success border-success/20';
    if (score >= 75) return 'bg-primary/10 text-primary border-primary/20';
    if (score >= 60) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border',
        getScoreColor(score),
        sizeClasses[size]
      )}
    >
      {score}
    </span>
  );
}
