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
import { LeadCard } from '@/components/leads/LeadCard';
import { useLeads } from '@/contexts/LeadContext';
import { industries, locations, companySizes } from '@/data/mockData';
import { Search, Sparkles, Filter, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

export default function Discovery() {
  const { leads, setSelectedLead } = useLeads();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    industry: 'All Industries',
    location: 'All Locations',
    size: 'All Sizes',
    minScore: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const filteredLeads = leads.filter((lead) => {
    if (filters.industry !== 'All Industries' && lead.industry !== filters.industry) return false;
    if (filters.location !== 'All Locations' && lead.location !== filters.location) return false;
    if (filters.size !== 'All Sizes' && lead.size !== filters.size) return false;
    if (lead.qualityScore < filters.minScore) return false;
    if (searchQuery && !lead.businessName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleLeadClick = (lead: typeof leads[0]) => {
    setSelectedLead(lead);
    navigate('/dashboard');
  };

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
              <Select
                value={filters.location}
                onValueChange={(value) => setFilters({ ...filters, location: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Company Size</Label>
              <Select
                value={filters.size}
                onValueChange={(value) => setFilters({ ...filters, size: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="Search by business name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              variant="gradient" 
              onClick={handleSearch}
              disabled={isSearching}
              className="min-w-[140px]"
            >
              {isSearching ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Find Leads
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        {hasSearched && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {filteredLeads.length} Leads Found
                </h2>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="space-y-3">
              {filteredLeads.map((lead, index) => (
                <div 
                  key={lead.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <LeadCard 
                    lead={lead} 
                    onClick={() => handleLeadClick(lead)}
                  />
                </div>
              ))}
            </div>

            {filteredLeads.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No leads match your criteria. Try adjusting your filters.</p>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && (
          <Card className="p-12 text-center border-dashed animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
              <Search className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Ready to discover new leads</h3>
            <p className="text-muted-foreground mb-4">Set your criteria above and click "Find Leads" to get started</p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
