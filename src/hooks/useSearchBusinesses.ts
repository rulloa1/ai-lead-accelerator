import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/lead';

interface SearchParams {
  query?: string;
  location?: string;
  industry?: string;
  maxResults?: number;
}

type SerializedLead = Omit<Lead, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

interface SearchResult {
  success: boolean;
  data?: SerializedLead[];
  total?: number;
  error?: string;
}

export function useSearchBusinesses() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Lead[]>([]);

  const searchBusinesses = async (params: SearchParams): Promise<Lead[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke<SearchResult>(
        'search-businesses',
        {
          body: params,
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to search businesses');
      }

      const leads: Lead[] = (data.data || []).map((business) => ({
        ...business,
        createdAt: new Date(business.createdAt),
        updatedAt: new Date(business.updatedAt),
      }));

      setResults(leads);
      return leads;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchBusinesses,
    isLoading,
    error,
    results,
  };
}
