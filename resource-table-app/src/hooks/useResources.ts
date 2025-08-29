'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ResourceDocument } from '@/types/resource';

interface UseResourcesReturn {
  resources: ResourceDocument[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useResources(): UseResourcesReturn {
  const [resources, setResources] = useState<ResourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resourcesCollection = collection(db, 'resources');
      const snapshot = await getDocs(resourcesCollection);
      
      const fetchedResources: ResourceDocument[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ResourceDocument[];
      
      setResources(fetchedResources);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    error,
    refetch: fetchResources,
  };
}