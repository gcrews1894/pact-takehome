'use client';

import { useState } from 'react';
import { ResourceTable } from '@/components/ResourceTable';
import { ResourceDetail } from '@/components/ResourceDetail';
import { Button } from '@/components/ui/button';
import { useResources } from '@/hooks/useResources';
import { ResourceDocument } from '@/types/resource';

export default function ResourcesPage() {
  const { resources, loading, error, refetch } = useResources();
  const [selectedResource, setSelectedResource] = useState<ResourceDocument | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRowClick = (resource: ResourceDocument) => {
    setSelectedResource(resource);
    setIsDetailOpen(true);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Error Loading Resources</h1>
          <p className="text-muted-foreground max-w-md">
            {error}
          </p>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EHR Resources</h1>
          <p className="text-muted-foreground">
            Manage and view electronic health record resources
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <ResourceTable 
        data={resources} 
        loading={loading} 
        onRowClick={handleRowClick} 
      />

      <ResourceDetail
        resource={selectedResource}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}