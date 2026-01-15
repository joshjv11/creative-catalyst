import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { StatsPanel } from './StatsPanel';
import { ClickHeatmap } from './ClickHeatmap';
import { TimelineView } from './TimelineView';
import { SessionsList } from './SessionsList';
import { ProjectsManager } from './ProjectsManager';
import { SiteImagesManager } from './SiteImagesManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, BarChart3, Map, Clock, Users, FolderKanban, Image } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor and optimize your portfolio</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-wide py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Heatmap
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <StatsPanel />
          </TabsContent>

          <TabsContent value="heatmap" className="mt-0">
            <ClickHeatmap />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <TimelineView />
          </TabsContent>

          <TabsContent value="sessions" className="mt-0">
            <SessionsList />
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            <SiteImagesManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

