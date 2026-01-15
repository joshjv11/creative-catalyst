import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Clock, MousePointer, Eye, Scroll, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface AnalyticsEvent {
  id: string;
  type: 'click' | 'scroll' | 'hover' | 'form' | 'view';
  element?: string;
  section?: string;
  timestamp: number;
  sessionId: string;
  metadata?: Record<string, any>;
}

interface AnalyticsData {
  events: AnalyticsEvent[];
}

const eventIcons = {
  click: MousePointer,
  scroll: Scroll,
  hover: Eye,
  form: FileText,
  view: Eye,
};

const eventColors = {
  click: 'text-blue-500',
  scroll: 'text-green-500',
  hover: 'text-purple-500',
  form: 'text-orange-500',
  view: 'text-cyan-500',
};

export const TimelineView = () => {
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [limit, setLimit] = useState(50);

  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/data', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 5000,
  });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading timeline...</div>;
  }

  if (!data) {
    return <div className="text-muted-foreground">No data available</div>;
  }

  // Filter and sort events
  let filteredEvents = [...data.events];
  
  if (eventTypeFilter !== 'all') {
    filteredEvents = filteredEvents.filter(e => e.type === eventTypeFilter);
  }

  filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
  filteredEvents = filteredEvents.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Interaction Timeline
            </CardTitle>
            <CardDescription>Chronological view of all user interactions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="click">Clicks</SelectItem>
                <SelectItem value="scroll">Scrolls</SelectItem>
                <SelectItem value="hover">Hovers</SelectItem>
                <SelectItem value="form">Forms</SelectItem>
                <SelectItem value="view">Views</SelectItem>
              </SelectContent>
            </Select>
            <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 events</SelectItem>
                <SelectItem value="50">50 events</SelectItem>
                <SelectItem value="100">100 events</SelectItem>
                <SelectItem value="200">200 events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const Icon = eventIcons[event.type] || Clock;
              const colorClass = eventColors[event.type] || 'text-muted-foreground';

              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className={`mt-1 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm capitalize">{event.type}</span>
                      {event.section && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {event.section}
                        </span>
                      )}
                    </div>
                    {event.element && (
                      <div className="text-sm text-muted-foreground truncate mb-1">
                        {event.element}
                      </div>
                    )}
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {Object.entries(event.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {typeof value === 'number' ? value.toLocaleString() : String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(event.timestamp), 'PPp')}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No events found for the selected filter
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


