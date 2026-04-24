import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Define API response type
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
}

// Define error response type
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  data?: unknown;
}

// Custom endpoints
export enum ApiEndpoints {
  // Auth endpoints
  LOGIN = '/login',
  LOGOUT = '/logout',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgotPassword',
  RESET_PASSWORD = '/resetPassword',
  VERIFY_TOKEN = '/session',
  
  // Media endpoints
  GET_SHOWS = '/api/media/shows',
  GET_SHOW = '/api/media/shows/{id}',
  GET_LIVE_SHOWS = '/api/media/shows/live',
  GET_UPCOMING_SHOWS = '/api/media/shows/upcoming',
  GET_EPISODE = '/api/media/shows/{showId}/episodes/{episodeId}',
  
  // User interaction endpoints
  ADD_COMMENT = '/api/interaction/comments',
  LIKE_SHOW = '/api/interaction/likes/show/{showId}',
  LIKE_EPISODE = '/api/interaction/likes/episode/{episodeId}',
  GET_USER_PROFILE = '/api/users/profile',
  UPDATE_USER_PROFILE = '/api/users/profile/update',
}

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;
  
  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') {
    // Create axios instance
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 seconds
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable cookies for authentication
    });
    
    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Get token from cookies
        const token = Cookies.get('jwt-token');
        
        // If token exists, add it to the headers
        if (token) {
          config.headers.Authorization = `${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(this.formatError(error))
    );
    
    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Check if error is due to expired token and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Mark that we're retrying this request
          originalRequest._retry = true;
          
          try {
            // Get a new token
            await this.refreshToken();
            
            // Get the new token from cookies
            const newToken = Cookies.get('jwt-token');
            
            // Add the new token to the original request
            if (newToken) {
              originalRequest.headers.Authorization = `${newToken}`;
            }
            
            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login page
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(this.formatError(refreshError));
          }
        }
        
        // For other errors, just format and return them
        return Promise.reject(this.formatError(error));
      }
    );
  }
  
  // Method to handle token refresh
  private async refreshToken(): Promise<string> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    // Create a new refresh token request
    this.refreshPromise = new Promise<string>(async (resolve, reject) => {
      try {
        // Make a request to the refresh endpoint
        const response = await axios.post(
          `${this.client.defaults.baseURL}/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        // Get the new token from the response
        const newToken = response.data.token;
        
        // Store the new token in cookies
        Cookies.set('jwt-token', newToken, { expires: 1 }); // 1 day
        
        // Resolve with the new token
        resolve(newToken);
      } catch (error) {
        // If refresh fails, remove the token
        Cookies.remove('jwt-token');
        reject(error);
      } finally {
        // Reset the refresh promise
        this.refreshPromise = null;
      }
    });
    
    return this.refreshPromise;
  }
  
  // Utility to format errors
  private formatError(error: AxiosError): ApiError {
    if (error.response) {
      // The request was made and the server responded with a status outside the range of 2xx
      return {
        message: error.response.data?.message || 'Server error',
        code: error.response.data?.code,
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response from server',
        code: 'NETWORK_ERROR',
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        message: error.message || 'Unknown error',
        code: 'UNKNOWN_ERROR',
      };
    }
  }
  
  // Generic request method
  private async request<T = unknown>(
    method: string,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client({
        method,
        url,
        data,
        ...config,
      });
      
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Helper to replace URL parameters
  private replaceParams(url: string, params: Record<string, string | number>): string {
    let finalUrl = url;
    Object.entries(params).forEach(([key, value]) => {
      finalUrl = finalUrl.replace(`{${key}}`, String(value));
    });
    return finalUrl;
  }
  
  // HTTP methods
  public async get<T = unknown>(
    url: string,
    params?: Record<string, string | number>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalUrl = params ? this.replaceParams(url, params) : url;
    return this.request<T>('GET', finalUrl, undefined, {
      ...config,
      params: config?.params,
    });
  }

  public async post<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, string | number>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalUrl = params ? this.replaceParams(url, params) : url;
    return this.request<T>('POST', finalUrl, data, config);
  }

  public async put<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, string | number>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalUrl = params ? this.replaceParams(url, params) : url;
    return this.request<T>('PUT', finalUrl, data, config);
  }

  public async delete<T = unknown>(
    url: string,
    params?: Record<string, string | number>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalUrl = params ? this.replaceParams(url, params) : url;
    return this.request<T>('DELETE', finalUrl, undefined, config);
  }

  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, string | number>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const finalUrl = params ? this.replaceParams(url, params) : url;
    return this.request<T>('PATCH', finalUrl, data, config);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
