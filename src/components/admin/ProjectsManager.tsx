import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { ProjectForm } from './ProjectForm';
import { ProjectList } from './ProjectList';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  websiteLink?: string;
  techStack: string[];
  order: number;
  createdAt: number;
  updatedAt: number;
}

export const ProjectsManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Failed to create project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      toast.success('Project created successfully');
    },
    onError: () => {
      toast.error('Failed to create project');
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...projectData }: Project) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error('Failed to update project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      setEditingProject(undefined);
      toast.success('Project updated successfully');
    },
    onError: () => {
      toast.error('Failed to update project');
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete project');
    },
  });

  // Reorder projects mutation
  const reorderMutation = useMutation({
    mutationFn: async (projectIds: string[]) => {
      const response = await fetch('/api/projects/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectIds }),
      });
      if (!response.ok) throw new Error('Failed to reorder projects');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Failed to reorder projects');
    },
  });

  const handleSave = async (projectData: Omit<Project, 'id' | 'order' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      await updateMutation.mutateAsync({ ...editingProject, ...projectData });
    } else {
      await createMutation.mutateAsync(projectData);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleReorder = (projectIds: string[]) => {
    reorderMutation.mutate(projectIds);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleAddNew = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  if (isFormOpen) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h2>
          <Button variant="outline" onClick={handleCancel}>
            Back to List
          </Button>
        </div>
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects. Drag and drop to reorder.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
};


