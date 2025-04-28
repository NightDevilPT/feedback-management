// hooks/useApi.ts
"use client";

import { useState, useCallback } from 'react';
import apiService from '../services/api.service';

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callApi = useCallback(async <T>(apiCall: () => Promise<T>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    callApi,
    get: useCallback(<T>(url: string, config?: any) => callApi<T>(() => apiService.get(url, config)), []),
    post: useCallback(<T>(url: string, data?: any, config?: any) => callApi<T>(() => apiService.post(url, data, config)), []),
    put: useCallback(<T>(url: string, data?: any, config?: any) => callApi<T>(() => apiService.put(url, data, config)), []),
    patch: useCallback(<T>(url: string, data?: any, config?: any) => callApi<T>(() => apiService.patch(url, data, config)), []),
    delete: useCallback(<T>(url: string, config?: any) => callApi<T>(() => apiService.delete(url, config)), [])
  };
};

export default useApi;