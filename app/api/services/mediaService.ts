import apiClient, { ApiEndpoints, ApiResponse } from '../apiClient';

// Define types for media content
export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  durationSeconds: number;
  publishDate: string;
  playCount: number;
  imageUrl?: string;
}

export interface RadioShow {
  id: string;
  title: string;
  description: string;
  hostName: string;
  imageUrl: string;
  isLive: boolean;
  scheduledTime: string;
  endTime: string;
  tags: string[];
  episodes: Episode[];
}

// Media Service Class
class MediaService {
  /**
   * Get all radio shows
   */
  public async getAllShows(): Promise<RadioShow[]> {
    const response = await apiClient.get<RadioShow[]>(ApiEndpoints.GET_SHOWS);
    return response.data;
  }
  
  /**
   * Get a specific radio show by ID
   */
  public async getShowById(id: string): Promise<RadioShow> {
    const response = await apiClient.get<RadioShow>(ApiEndpoints.GET_SHOW, { id });
    return response.data;
  }
  
  /**
   * Get all currently live shows
   */
  public async getLiveShows(): Promise<RadioShow[]> {
    const response = await apiClient.get<RadioShow[]>(ApiEndpoints.GET_LIVE_SHOWS);
    return response.data;
  }
  
  /**
   * Get all upcoming scheduled shows
   */
  public async getUpcomingShows(): Promise<RadioShow[]> {
    const response = await apiClient.get<RadioShow[]>(ApiEndpoints.GET_UPCOMING_SHOWS);
    return response.data;
  }
  
  /**
   * Get a specific episode by show ID and episode ID
   */
  public async getEpisode(showId: string, episodeId: string): Promise<Episode> {
    const response = await apiClient.get<Episode>(
      ApiEndpoints.GET_EPISODE,
      { showId, episodeId }
    );
    return response.data;
  }
  
  /**
   * Increment play count for an episode
   */
  public async incrementPlayCount(showId: string, episodeId: string): Promise<void> {
    await apiClient.post(`/api/media/shows/${showId}/episodes/${episodeId}/play`);
  }
  
  /**
   * Search shows by query
   */
  public async searchShows(query: string): Promise<RadioShow[]> {
    const response = await apiClient.get<RadioShow[]>('/api/media/search', undefined, {
      params: { q: query }
    });
    return response.data;
  }
  
  /**
   * Get featured shows (could be most popular, etc.)
   */
  public async getFeaturedShows(): Promise<RadioShow[]> {
    const response = await apiClient.get<RadioShow[]>('/api/media/shows/featured');
    return response.data;
  }
  
  /**
   * Get recommended shows for a user
   */
  public async getRecommendedShows(): Promise<RadioShow[]> {
    const response = await apiClient.get<RadioShow[]>('/api/media/shows/recommended');
    return response.data;
  }
}

// Export a singleton instance
export const mediaService = new MediaService();
export default mediaService;
