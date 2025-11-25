/**
 * Mock API Client - Simulates network delays and provides mock data
 */

const DELAY_MIN = 200;
const DELAY_MAX = 500;

const delay = (ms: number = Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class MockApiClient {
  private storage: Map<string, any> = new Map();

  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      delay?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', body, delay: customDelay } = options;

    // Simulate network delay
    await delay(customDelay);

    // Simulate occasional network errors (5% chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }

    // Store endpoint for later retrieval
    const key = `${method}:${endpoint}`;
    if (body) {
      this.storage.set(key, body);
    }

    return {
      success: true,
      data: null as T,
    };
  }

  get<T>(endpoint: string, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', delay });
  }

  post<T>(endpoint: string, body?: any, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, delay });
  }

  put<T>(endpoint: string, body?: any, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, delay });
  }

  delete<T>(endpoint: string, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', delay });
  }

  patch<T>(endpoint: string, body?: any, delay?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, delay });
  }
}

export const mockApi = new MockApiClient();

