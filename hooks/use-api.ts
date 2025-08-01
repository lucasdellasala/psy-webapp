// Custom React Hooks for API calls

import { useState, useEffect, useCallback } from 'react';
import { 
  getTopics, 
  getTherapists, 
  getTherapistById, 
  getTherapistSessionTypes, 
  getTherapistAvailability,
  createSession,
  getSessionById,
  cancelSession
} from '@/lib/api-client';
import type { 
  Topic, 
  Therapist, 
  SessionType, 
  DayAvailability, 
  Session, 
  CreateSessionRequest,
  TherapistsQueryParams,
  AvailabilityQueryParams
} from '@/lib/types';

// Generic hook for API calls
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

// Hook for topics
export function useTopics() {
  return useApiCall(() => getTopics());
}

// Hook for therapists with filters
export function useTherapists(params?: TherapistsQueryParams) {
  return useApiCall(() => getTherapists(params), [JSON.stringify(params)]);
}

// Hook for single therapist
export function useTherapist(id: string) {
  return useApiCall(() => getTherapistById(id), [id]);
}

// Hook for therapist session types
export function useTherapistSessionTypes(therapistId: string) {
  return useApiCall(() => getTherapistSessionTypes(therapistId), [therapistId]);
}

// Hook for therapist availability
export function useTherapistAvailability(
  therapistId: string, 
  params: AvailabilityQueryParams | null
) {
  return useApiCall(
    () => {
      if (!params) {
        return Promise.resolve([]);
      }
      return getTherapistAvailability(therapistId, params);
    },
    [therapistId, JSON.stringify(params)]
  );
}

// Hook for session creation
export function useCreateSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const create = useCallback(async (
    sessionData: CreateSessionRequest,
    idempotencyKey?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createSession(sessionData, idempotencyKey);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error, data };
}

// Hook for session details
export function useSession(sessionId: string) {
  return useApiCall(() => getSessionById(sessionId), [sessionId]);
}

// Hook for session cancellation
export function useCancelSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      await cancelSession(sessionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, loading, error };
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  initialData: T,
  updateFn: (data: T, update: Partial<T>) => T
) {
  const [data, setData] = useState<T>(initialData);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const optimisticUpdate = useCallback((update: Partial<T>) => {
    setData(prev => updateFn(prev, update));
    setIsOptimistic(true);
  }, [updateFn]);

  const confirmUpdate = useCallback((confirmedData: T) => {
    setData(confirmedData);
    setIsOptimistic(false);
  }, []);

  const revertUpdate = useCallback(() => {
    setData(initialData);
    setIsOptimistic(false);
  }, [initialData]);

  return { data, isOptimistic, optimisticUpdate, confirmUpdate, revertUpdate };
} 