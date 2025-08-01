// API Client for Backend Communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search);
  }

  // POST request
  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Health check
export const healthCheck = () => apiClient.get('/health');

// Topics
export const getTopics = () => apiClient.get<any[]>('/topics');

// Therapists
export const getTherapists = (params?: Record<string, any>) => 
  apiClient.get<any[]>('/therapists', params);

export const getTherapistById = (id: string) => 
  apiClient.get<any>(`/therapists/${id}`);

export const getTherapistSessionTypes = (id: string) => 
  apiClient.get<any[]>(`/therapists/${id}/session-types`);

export const getTherapistAvailability = (id: string, params: Record<string, any>) =>{
  return apiClient.get<any>(`/therapists/${id}/availability`, params);
}

// Sessions
export const createSession = (data: any, idempotencyKey?: string) => {
  const headers: Record<string, string> = {};
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }
  return apiClient.post<any>('/sessions', data, headers);
};

export const getSessionById = (id: string) => {
  return apiClient.get<any>(`/sessions/${id}`)
}

export const cancelSession = (id: string) => {
  return apiClient.patch<any>(`/sessions/${id}/cancel`)
} 