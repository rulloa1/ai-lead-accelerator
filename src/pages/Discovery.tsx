import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RealLeadCard } from '@/components/leads/RealLeadCard';
import { useLeads } from '@/contexts/LeadContext';
import { useSearchBusinesses } from '@/hooks/useSearchBusinesses';
import { industries

 } from '@/data/mockData';
import { Search, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

export default function Discovery() {
  const { addLead, setSelectedLead } = useLeads();
  const { searchBusinesses, isLoading, error, results } = useSearchBusinesses();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    industry: 'All Industries',
    location: '',
    minScore: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    try {
      await searchBusinesses({
        query: searchQuery || undefined,
        location: filters.location || undefined,
        industry: filters.industry !== 'All Industries' ? filters.industry : undefined,
        maxResults: 20,
      });
      setHasSearched(true);
    } catch (err) {
      toast.error('Search failed. Please check your API key configuration.');
    }
  };

  const handleAddLead = (lead: Lead) => {
    addLead(lead);
    toast.success(`Added ${lead.businessName} to your leads`);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    navigate('/dashboard');
  };

  const filteredResults = results.filter((lead) => {
    if (lead.qualityScore < filters.minScore) return false;
    return true;
  });


  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Lead Discovery</h1>
          <p className="text-muted-foreground">Find and qualify potential customers for your AI solutions</p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 bg-gradient-surface border-border animate-slide-up">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Search Criteria</h2>
              <p className="text-sm text-muted-foreground">Define your ideal customer profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Industry</Label>
              <Select
                value={filters.industry}
                onValueChange={(value) => setFilters({ ...filters, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Location</Label>
              <Input
                placeholder="City, State or Region..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Min Quality Score: {filters.minScore}</Label>
              <div className="pt-2">
                <Slider
                  value={[filters.minScore]}
                  onValueChange={(value) => setFilters({ ...filters, minScore: value[0] })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses (e.g., 'dentists', 'coffee shops')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              variant="gradient" 
              onClick={handleSearch}
              disabled={isLoading}
              className="min-w-[160px]"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Searching Google...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Find Businesses
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {filteredResults.length} Businesses Found
                </h2>
                <span className="text-sm text-muted-foreground">
                  (sorted by lowest Google presence)
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {filteredResults.map((lead, index) => (
                <div 
                  key={lead.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <RealLeadCard 
                    lead={lead as any}
                    onAdd={() => handleAddLead(lead)}
                    onView={() => handleViewLead(lead)}
                  />
                </div>
              ))}
            </div>

            {filteredResults.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No businesses found. Try a different search or location.</p>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && (
          <Card className="p-12 text-center border-dashed animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
              <Search className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Find businesses with low online presence</h3>
            <p className="text-muted-foreground mb-4">
              Search for businesses by type and location. Results are sorted by lowest Google presence—perfect leads for AI solutions.
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
