import { useState, useEffect, useCallback } from 'react';
import { HerdOverview, AmuEntry, MetricType } from '../types';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.statusText}`);
  }
  if (res.status === 204) { // No Content
    return null as T;
  }
  return res.json();
}

export function useApiData() {
  const [herdOverview, setHerdOverview] = useState<HerdOverview | null>(null);
  const [amuEntries, setAmuEntries] = useState<AmuEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('mg_per_pcu');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [overview, entries] = await Promise.all([
        apiFetch<HerdOverview>('/api/herd-overview'),
        apiFetch<AmuEntry[]>('/api/amu-entries')
      ]);
      setHerdOverview(overview);
      setAmuEntries(entries);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addEntry = async (entry: Omit<AmuEntry, 'id'>) => {
    await apiFetch('/api/amu-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    await fetchData();
  };

  const updateEntry = async (id: string, updates: Partial<AmuEntry>) => {
    const originalEntry = amuEntries.find(e => e.id === id);
    await apiFetch(`/api/amu-entries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...originalEntry, ...updates }),
    });
    await fetchData();
  };

  const deleteEntry = async (id: string) => {
    await apiFetch(`/api/amu-entries/${id}`, { method: 'DELETE' });
    await fetchData();
  };

  return {
    herdOverview,
    amuEntries,
    loading,
    error,
    selectedMetric,
    setSelectedMetric,
    addEntry,
    updateEntry,
    deleteEntry
  };
}
