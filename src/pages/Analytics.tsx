import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { useLeads } from '@/contexts/LeadContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Users, 
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const COLORS = ['hsl(252, 56%, 57%)', 'hsl(199, 89%, 48%)', 'hsl(160, 60%, 45%)', 'hsl(220, 9%, 46%)', 'hsl(173, 58%, 39%)'];

export default function Analytics() {
  const { leads } = useLeads();

  const stats = useMemo(() => {
    const total = leads.length;
    const closed = leads.filter(l => l.status === 'closed').length;
    const interested = leads.filter(l => l.status === 'interested').length;
    const contacted = leads.filter(l => l.status === 'contacted').length;
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : 0;
    const avgScore = leads.reduce((sum, l) => sum + l.qualityScore, 0) / total || 0;

    return {
      total,
      closed,
      interested,
      contacted,
      conversionRate,
      avgScore: avgScore.toFixed(0),
    };
  }, [leads]);

  const statusData = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'New', value: statusCounts['new'] || 0 },
      { name: 'Contacted', value: statusCounts['contacted'] || 0 },
      { name: 'Interested', value: statusCounts['interested'] || 0 },
      { name: 'Not Interested', value: statusCounts['not-interested'] || 0 },
      { name: 'Closed', value: statusCounts['closed'] || 0 },
    ];
  }, [leads]);

  const industryData = useMemo(() => {
    const industryCounts = leads.reduce((acc, lead) => {
      acc[lead.industry] = (acc[lead.industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(industryCounts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const weeklyData = [
    { name: 'Mon', leads: 4, closed: 1 },
    { name: 'Tue', leads: 6, closed: 2 },
    { name: 'Wed', leads: 8, closed: 1 },
    { name: 'Thu', leads: 5, closed: 3 },
    { name: 'Fri', leads: 9, closed: 2 },
    { name: 'Sat', leads: 3, closed: 1 },
    { name: 'Sun', leads: 2, closed: 0 },
  ];

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your outreach performance and conversion rates</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Leads', 
              value: stats.total, 
              icon: Users, 
              change: '+12%',
              positive: true,
              color: 'text-foreground'
            },
            { 
              label: 'Conversion Rate', 
              value: `${stats.conversionRate}%`, 
              icon: Target, 
              change: '+5.2%',
              positive: true,
              color: 'text-success'
            },
            { 
              label: 'Deals Closed', 
              value: stats.closed, 
              icon: CheckCircle, 
              change: '+3',
              positive: true,
              color: 'text-primary'
            },
            { 
              label: 'Avg Quality Score', 
              value: stats.avgScore, 
              icon: Activity, 
              change: '-2',
              positive: false,
              color: 'text-accent'
            },
          ].map((stat, index) => (
            <Card 
              key={stat.label} 
              className="p-6 animate-slide-up"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`flex items-center gap-1 mt-3 text-sm ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                {stat.positive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{stat.change} vs last week</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Activity */}
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Weekly Activity</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(173, 58%, 39%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClosed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(252, 56%, 57%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(252, 56%, 57%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="name" stroke="hsl(220, 9%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(220, 13%, 91%)',
                    borderRadius: '8px',
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(173, 58%, 39%)" 
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="closed" 
                  stroke="hsl(252, 56%, 57%)" 
                  fillOpacity={1} 
                  fill="url(#colorClosed)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Pipeline Status */}
          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Pipeline Status</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)', 
                    border: '1px solid hsl(220, 13%, 91%)',
                    borderRadius: '8px',
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Industry Breakdown */}
        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Leads by Industry</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis type="number" stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(220, 9%, 46%)" fontSize={12} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(0, 0%, 100%)', 
                  border: '1px solid hsl(220, 13%, 91%)',
                  borderRadius: '8px',
                }} 
              />
              <Bar 
                dataKey="value" 
                fill="hsl(173, 58%, 39%)" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AppLayout>
  );
}
