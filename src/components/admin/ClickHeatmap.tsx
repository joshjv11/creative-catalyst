import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

interface ClickData {
  x: number;
  y: number;
  count: number;
}

interface AnalyticsData {
  events: Array<{
    type: string;
    position?: { x: number; y: number };
    section?: string;
  }>;
}

export const ClickHeatmap = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

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
    return <div className="text-muted-foreground">Loading heatmap data...</div>;
  }

  if (!data) {
    return <div className="text-muted-foreground">No data available</div>;
  }

  // Aggregate clicks by position
  const clickEvents = data.events.filter(e => e.type === 'click' && e.position);
  const clickMap: Record<string, number> = {};

  clickEvents.forEach(event => {
    if (!event.position) return;
    if (selectedSection && event.section !== selectedSection) return;

    // Round positions to create heat zones (every 50px)
    const x = Math.floor(event.position.x / 50) * 50;
    const y = Math.floor(event.position.y / 50) * 50;
    const key = `${x},${y}`;
    clickMap[key] = (clickMap[key] || 0) + 1;
  });

  // Convert to array and find max for normalization
  const clickData: ClickData[] = Object.entries(clickMap).map(([key, count]) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y, count };
  });

  const maxClicks = Math.max(...clickData.map(d => d.count), 1);

  // Get unique sections
  const sections = Array.from(new Set(clickEvents.map(e => e.section).filter(Boolean)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Click Heatmap
            </CardTitle>
            <CardDescription>Visual representation of click density on your portfolio</CardDescription>
          </div>
          <Button
            variant={showHeatmap ? "default" : "outline"}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            {showHeatmap ? 'Hide' : 'Show'} Heatmap
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Section Filter */}
        {sections.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSection === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSection(null)}
            >
              All Sections
            </Button>
            {sections.map(section => (
              <Button
                key={section}
                variant={selectedSection === section ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSection(section)}
              >
                {section}
              </Button>
            ))}
          </div>
        )}

        {/* Heatmap Visualization */}
        {showHeatmap && (
          <div className="relative border border-border rounded-lg overflow-hidden bg-muted/20" style={{ minHeight: '600px' }}>
            {clickData.length > 0 ? (
              clickData.map((point, index) => {
                const intensity = point.count / maxClicks;
                const opacity = Math.max(0.3, intensity);
                const size = Math.max(20, 30 * intensity);

                return (
                  <div
                    key={index}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: `${point.x}px`,
                      top: `${point.y}px`,
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: `0 0 ${size}px rgba(59, 130, 246, ${opacity * 0.5})`,
                    }}
                    title={`${point.count} clicks at (${point.x}, ${point.y})`}
                  />
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No click data available for {selectedSection || 'all sections'}
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{clickData.length}</div>
            <div className="text-xs text-muted-foreground">Heat Zones</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{clickEvents.length}</div>
            <div className="text-xs text-muted-foreground">Total Clicks</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">{maxClicks}</div>
            <div className="text-xs text-muted-foreground">Max in Zone</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold">
              {selectedSection || 'All'}
            </div>
            <div className="text-xs text-muted-foreground">Section</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


