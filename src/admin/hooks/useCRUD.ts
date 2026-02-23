import { useState, useEffect, useCallback } from 'react';

interface UseCRUDOptions<T> {
  fetchFn: (options?: any) => Promise<{ data: T[]; count: number }>;
  createFn?: (data: Partial<T>) => Promise<T>;
  updateFn?: (id: string, data: Partial<T>) => Promise<T>;
  deleteFn?: (id: string) => Promise<void>;
  defaultPageSize?: number;
}

interface UseCRUDReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  search: string;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (search: string) => void;
  refresh: () => Promise<void>;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
  remove: (id: string) => Promise<boolean>;
}

export function useCRUD<T extends { id: string | number }>(options: UseCRUDOptions<T>): UseCRUDReturn<T> {
  const {
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    defaultPageSize = 10
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn({
        page: currentPage,
        limit: pageSize,
        search
      });
      setData(result.data);
      setTotalCount(result.count);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, currentPage, pageSize, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = async () => {
    await fetchData();
  };

  const create = async (item: Partial<T>): Promise<T | null> => {
    if (!createFn) {
      throw new Error('Create function not provided');
    }
    try {
      const newItem = await createFn(item);
      await refresh();
      return newItem;
    } catch (err: any) {
      throw err;
    }
  };

  const update = async (id: string, item: Partial<T>): Promise<T | null> => {
    if (!updateFn) {
      throw new Error('Update function not provided');
    }
    try {
      const updatedItem = await updateFn(id, item);
      await refresh();
      return updatedItem;
    } catch (err: any) {
      throw err;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    if (!deleteFn) {
      throw new Error('Delete function not provided');
    }
    try {
      await deleteFn(id);
      await refresh();
      return true;
    } catch (err: any) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    totalCount,
    currentPage,
    pageSize,
    search,
    setCurrentPage,
    setPageSize,
    setSearch,
    refresh,
    create,
    update,
    remove
  };
}

// Hook for toggle status
export function useToggleStatus<T>(
  toggleFn: (id: string, currentStatus: string) => Promise<T>
) {
  const [loading, setLoading] = useState(false);

  const toggle = async (id: string, currentStatus: string): Promise<T | null> => {
    setLoading(true);
    try {
      const result = await toggleFn(id, currentStatus);
      return result;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { toggle, loading };
}

// Hook for optimistic updates
export function useOptimisticUpdate<T extends { id: string }>(
  updateFn: (id: string, data: Partial<T>) => Promise<T>
) {
  const [loading, setLoading] = useState<string | null>(null);

  const update = async (id: string, data: Partial<T>, 
    onOptimistic: (data: Partial<T>) => void
  ): Promise<T | null> => {
    setLoading(id);
    try {
      const result = await updateFn(id, data);
      return result;
    } catch (err) {
      throw err;
    } finally {
      setLoading(null);
    }
  };

  return { update, loading };
}
