import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadDetailPanel } from '@/components/leads/LeadDetailPanel';
import { useLeads } from '@/contexts/LeadContext';
import { industries } from '@/data/mockData';
import { LeadStatus } from '@/types/lead';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Users,
  MessageSquare,
  Star,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'not-interested', label: 'Not Interested' },
  { value: 'closed', label: 'Closed' },
];

export default function Dashboard() {
  const { leads, selectedLead, setSelectedLead } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('All Industries');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filterIndustry !== 'All Industries' && lead.industry !== filterIndustry) return false;
      if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          lead.businessName.toLowerCase().includes(query) ||
          lead.contactName?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [leads, filterIndustry, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      interested: leads.filter((l) => l.status === 'interested').length,
      closed: leads.filter((l) => l.status === 'closed').length,
    };
  }, [leads]);

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-0px)]">
        {/* Main Content */}
        <div className={cn(
          "flex-1 p-8 overflow-y-auto transition-all duration-300",
          selectedLead ? "mr-[400px]" : ""
        )}>
          {/* Header */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Lead Dashboard</h1>
            <p className="text-muted-foreground">Manage and track your sales pipeline</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total Leads', value: stats.total, icon: Users, color: 'text-foreground' },
              { label: 'New', value: stats.new, icon: Star, color: 'text-accent' },
              { label: 'Contacted', value: stats.contacted, icon: MessageSquare, color: 'text-info' },
              { label: 'Interested', value: stats.interested, icon: CheckCircle, color: 'text-success' },
              { label: 'Closed', value: stats.closed, icon: CheckCircle, color: 'text-primary' },
            ].map((stat, index) => (
              <Card 
                key={stat.label} 
                className="p-4 animate-slide-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-secondary", stat.color)}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger className="w-[180px]">
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

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-lg p-1 ml-auto">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Lead List */}
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 gap-4" 
              : "space-y-3"
          )}>
            {filteredLeads.map((lead, index) => (
              <div 
                key={lead.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${0.03 * index}s` }}
              >
                <LeadCard
                  lead={lead}
                  compact={viewMode === 'grid'}
                  onClick={() => setSelectedLead(lead)}
                />
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <Card className="p-12 text-center">
              <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No leads found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </Card>
          )}
        </div>

        {/* Detail Panel */}
        {selectedLead && (
          <LeadDetailPanel 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
