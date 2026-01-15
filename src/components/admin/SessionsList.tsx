import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistance } from 'date-fns';
import { Users, Clock, MousePointer, Eye } from 'lucide-react';

interface Session {
  id: string;
  startTime: number;
  endTime: number;
  sections: string[];
  interactions: number;
}

interface AnalyticsData {
  sessions: Session[];
}

export const SessionsList = () => {
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
    return <div className="text-muted-foreground">Loading sessions...</div>;
  }

  if (!data) {
    return <div className="text-muted-foreground">No data available</div>;
  }

  // Sort sessions by start time (newest first)
  const sortedSessions = [...data.sessions].sort((a, b) => b.startTime - a.startTime);

  const formatDuration = (start: number, end: number) => {
    const seconds = Math.floor((end - start) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Sessions
        </CardTitle>
        <CardDescription>Detailed view of all visitor sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {sortedSessions.length > 0 ? (
            sortedSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-sm mb-1">
                      Session {session.id.substring(0, 8)}...
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Started {format(new Date(session.startTime), 'PPp')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatDuration(session.startTime, session.endTime)}
                    </div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{session.interactions}</div>
                      <div className="text-xs text-muted-foreground">Interactions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{session.sections.length}</div>
                      <div className="text-xs text-muted-foreground">Sections</div>
                    </div>
                  </div>
                </div>

                {session.sections.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground mb-2">Sections visited:</div>
                    <div className="flex flex-wrap gap-2">
                      {session.sections.map((section) => (
                        <span
                          key={section}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No sessions recorded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


