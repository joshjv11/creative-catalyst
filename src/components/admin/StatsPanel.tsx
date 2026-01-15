import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, MousePointer, Clock, Users } from 'lucide-react';

interface AnalyticsData {
  events: any[];
  sessions: any[];
  aggregated: {
    clicksByElement: Record<string, number>;
    clicksBySection: Record<string, number>;
    scrollDepth: Record<string, number>;
    timeOnSection: Record<string, number>;
    popularElements: Array<{ element: string; count: number }>;
  };
  totalEvents: number;
  totalSessions: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const StatsPanel = () => {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/data', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading statistics...</div>;
  }

  if (!data) {
    return <div className="text-muted-foreground">No data available</div>;
  }

  // Prepare chart data
  const sectionClicks = Object.entries(data.aggregated.clicksBySection)
    .map(([section, count]) => ({ name: section, value: count }))
    .sort((a, b) => b.value - a.value);

  const topElements = data.aggregated.popularElements.slice(0, 10);

  const sectionTime = Object.entries(data.aggregated.timeOnSection)
    .map(([section, time]) => ({ 
      name: section, 
      time: Math.round(time / 1000) // Convert to seconds
    }))
    .sort((a, b) => b.time - a.time);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All interactions tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Unique visitor sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.totalSessions > 0 
                ? Math.round(data.totalEvents / data.totalSessions) 
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Section</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sectionClicks[0]?.name || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {sectionClicks[0]?.value || 0} clicks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks by Section */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Section</CardTitle>
            <CardDescription>Distribution of clicks across page sections</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectionClicks}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectionClicks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time Spent by Section */}
        <Card>
          <CardHeader>
            <CardTitle>Time Spent by Section</CardTitle>
            <CardDescription>Average time users spend in each section (seconds)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectionTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Clicked Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Most Clicked Elements</CardTitle>
          <CardDescription>Top interactive elements by click count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topElements.length > 0 ? (
              topElements.map((item, index) => (
                <div key={item.element} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.element}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold">{item.count}</div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-center py-8">No click data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


