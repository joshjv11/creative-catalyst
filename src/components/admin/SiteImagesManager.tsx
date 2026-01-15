import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDown, ArrowUp, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface SiteImage {
  id: string;
  title: string;
  url: string;
}

interface SiteSettings {
  profileImage: string;
  siteImages: SiteImage[];
}

export const SiteImagesManager = () => {
  const queryClient = useQueryClient();
  const profileFileRef = useRef<HTMLInputElement>(null);
  const siteFileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery<SiteSettings>({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const response = await fetch('/api/site-settings');
      if (!response.ok) throw new Error('Failed to fetch site settings');
      return response.json();
    },
  });

  const [profileImage, setProfileImage] = useState('');
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingSite, setIsUploadingSite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setProfileImage(data.profileImage || '');
      setSiteImages(data.siteImages || []);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: SiteSettings) => {
      const response = await fetch('/api/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update site settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast.success('Site images updated');
    },
    onError: () => {
      toast.error('Failed to update site images');
    },
  });

  const handleUpload = async (
    file: File,
    setUploading: (state: boolean) => void,
  ) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return '';
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return '';
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('/api/site-settings/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      return result.url as string;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleUpload(file, setIsUploadingProfile);
    if (url) setProfileImage(url);
    if (profileFileRef.current) profileFileRef.current.value = '';
  };

  const handleSiteUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleUpload(file, setIsUploadingSite);
    if (url) setNewUrl(url);
    if (siteFileRef.current) siteFileRef.current.value = '';
  };

  const handleAddSiteImage = () => {
    const title = newTitle.trim();
    const url = newUrl.trim();
    if (!title || !url) {
      toast.error('Title and URL are required');
      return;
    }
    setSiteImages([
      ...siteImages,
      { id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, url },
    ]);
    setNewTitle('');
    setNewUrl('');
  };

  const handleRemoveSiteImage = (id: string) => {
    setSiteImages(siteImages.filter((img) => img.id !== id));
  };

  const moveSiteImage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= siteImages.length) return;
    const updated = [...siteImages];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setSiteImages(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({ profileImage, siteImages });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading images...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Update the profile image used on the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileImage && (
            <div className="w-full h-64 rounded-lg overflow-hidden border border-border bg-muted">
              <img src={profileImage} alt="Profile preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="profileImageUrl">Profile Image URL</Label>
            <Input
              id="profileImageUrl"
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Profile Image</Label>
            <div className="flex items-center gap-2">
              <Input
                ref={profileFileRef}
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => profileFileRef.current?.click()}
                disabled={isUploadingProfile}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploadingProfile ? 'Uploading...' : 'Choose File'}
              </Button>
              {profileImage && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setProfileImage('')}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website Images</CardTitle>
          <CardDescription>
            Upload and store image URLs for use across the site (reorder to set priority).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteImageTitle">Image Title</Label>
              <Input
                id="siteImageTitle"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Hero Banner, Case Study, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteImageUrl">Image URL</Label>
              <Input
                id="siteImageUrl"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              ref={siteFileRef}
              type="file"
              accept="image/*"
              onChange={handleSiteUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => siteFileRef.current?.click()}
              disabled={isUploadingSite}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploadingSite ? 'Uploading...' : 'Upload Image'}
            </Button>
            <Button type="button" onClick={handleAddSiteImage}>
              Add Image
            </Button>
          </div>

          {siteImages.length > 0 ? (
            <div className="space-y-3">
              {siteImages.map((img, index) => (
                <div
                  key={img.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground">{img.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{img.url}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSiteImage(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSiteImage(index, 'down')}
                      disabled={index === siteImages.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSiteImage(img.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No website images added yet.</div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
