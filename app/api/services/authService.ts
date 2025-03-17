import apiClient, { ApiEndpoints } from '../apiClient';
import Cookies from 'js-cookie';

// Define auth-related types
export interface LoginRequest {
  orgId: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  roles: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Auth Service Class
class AuthService {
  /**
   * Login user
   */
  public async login(request: LoginRequest): Promise<LoginResponse> {
    const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'default';
    const req = { ...request, orgId };
    
    const response = await apiClient.post<LoginResponse>(ApiEndpoints.LOGIN, req);
    
    // Set access token cookie from the response if it's not already set
    // (it should be set by the server, but we'll do it here too as a fallback)
    if (!Cookies.get('jwt-token') && response.data.accessToken) {
      Cookies.set('jwt-token', response.data.accessToken, {
        expires: new Date(new Date().getTime() + response.data.expiresIn * 1000),
        path: '/'
      });
    }
    
    return response.data;
  }
  
  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    const token = Cookies.get('jwt-token');
    if (token) {
      try {
        await apiClient.post(ApiEndpoints.LOGOUT);
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        // Remove cookies even if logout fails
        Cookies.remove('jwt-token');
      }
    }
  }
  
  /**
   * Register new user
   */
  public async signup(request: SignupRequest): Promise<void> {
    const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'default';
    await apiClient.post(ApiEndpoints.REGISTER, {
      ...request,
      orgId
    });
  }
  
  /**
   * Request password reset
   */
  public async forgotPassword(username: string): Promise<void> {
    const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'default';
    await apiClient.post(ApiEndpoints.FORGOT_PASSWORD, { orgId, username });
  }
  
  /**
   * Reset password with confirmation code
   */
  public async resetPassword(username: string, newPassword: string, confirmationCode: string): Promise<void> {
    const orgId = process.env.NEXT_PUBLIC_ORG_ID || 'default';
    await apiClient.post(ApiEndpoints.RESET_PASSWORD, {
      orgId,
      username,
      newPassword,
      confirmationCode
    });
  }
  
  /**
   * Verify JWT token and get user session
   */
  public async verifyToken(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(ApiEndpoints.VERIFY_TOKEN);
    return response.data;
  }
  
  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!Cookies.get('jwt-token');
  }
  
  /**
   * Get user profile
   */
  public async getUserProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(ApiEndpoints.GET_USER_PROFILE);
    return response.data;
  }
  
  /**
   * Update user profile
   */
  public async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put<UserProfile>(ApiEndpoints.UPDATE_USER_PROFILE, updates);
    return response.data;
  }
  
  /**
   * Update user preferences
   */
  public async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await apiClient.put<UserPreferences>('/api/users/preferences', preferences);
    return response.data;
  }
}

// Export a singleton instance
export const authService = new AuthService();
export default authService;
