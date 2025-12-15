import { Lead } from '@/types/lead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QualityScoreBadge } from './QualityScoreBadge';
import { StatusBadge } from './StatusBadge';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
  compact?: boolean;
}

export function LeadCard({ lead, onClick, compact = false }: LeadCardProps) {
  return (
    <Card 
      className={cn(
        "group bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/30",
        compact ? "p-4" : "p-5"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {lead.businessName}
            </h3>
            <StatusBadge status={lead.status} />
          </div>
          
          <div className={cn(
            "grid gap-2 text-sm text-muted-foreground",
            compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
          )}>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary/60" />
              <span className="truncate">{lead.industry}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary/60" />
              <span className="truncate">{lead.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary/60" />
              <span className="truncate">{lead.size}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-primary/60" />
              <span className="truncate">{lead.website}</span>
            </div>
          </div>

          {!compact && lead.contactName && (
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-sm">
              <span className="font-medium text-foreground">{lead.contactName}</span>
              {lead.email && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{lead.email}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <QualityScoreBadge score={lead.qualityScore} />
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
