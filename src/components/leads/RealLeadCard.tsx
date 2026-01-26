import { Lead } from '@/types/lead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QualityScoreBadge } from './QualityScoreBadge';
import { GooglePresenceBadge } from './GooglePresenceBadge';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Phone,
  ArrowRight,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealLeadCardProps {
  lead: Lead & {
    googleReviews?: number;
    googleRating?: number;
    hasWebsite?: boolean;
  };
  onAdd?: () => void;
  onView?: () => void;
}

export function RealLeadCard({ lead, onAdd, onView }: RealLeadCardProps) {
  return (
    <Card className="group bg-card hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {lead.businessName}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary/60" />
              <span className="truncate">{lead.industry}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 md:col-span-1">
              <MapPin className="w-4 h-4 text-primary/60" />
              <span className="truncate">{lead.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary/60" />
              <span className="truncate">{lead.size}</span>
            </div>
            {lead.website && lead.website !== 'No website' ? (
              <a 
                href={lead.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-4 h-4" />
                <span className="truncate">Website</span>
              </a>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground/50">
                <Globe className="w-4 h-4" />
                <span className="truncate">No website</span>
              </div>
            )}
          </div>

          {lead.phone && (
            <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>{lead.phone}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <QualityScoreBadge score={lead.qualityScore} />
          
          <GooglePresenceBadge 
            reviewCount={lead.googleReviews || 0}
            rating={lead.googleRating || 0}
            hasWebsite={lead.hasWebsite || false}
          />

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onAdd && (
              <Button 
                variant="gradient" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Lead
              </Button>
            )}
            {onView && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
              >
                View <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
