import apiClient, { ApiEndpoints } from '../apiClient';

// Define interaction types
export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  replyTo?: string;
}

export interface Like {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'show' | 'episode';
  timestamp: string;
}

export interface CommentRequest {
  targetId: string;
  targetType: 'show' | 'episode';
  content: string;
  replyTo?: string;
}

// Interaction Service Class
class InteractionService {
  /**
   * Add a comment
   */
  public async addComment(commentData: CommentRequest): Promise<Comment> {
    const response = await apiClient.post<Comment>(ApiEndpoints.ADD_COMMENT, commentData);
    return response.data;
  }
  
  /**
   * Get comments for a show or episode
   */
  public async getComments(targetType: 'show' | 'episode', targetId: string): Promise<Comment[]> {
    const response = await apiClient.get<Comment[]>(`/api/interaction/comments`, undefined, {
      params: { targetType, targetId }
    });
    return response.data;
  }
  
  /**
   * Like a show
   */
  public async likeShow(showId: string): Promise<void> {
    await apiClient.post(ApiEndpoints.LIKE_SHOW, undefined, { showId });
  }
  
  /**
   * Unlike a show
   */
  public async unlikeShow(showId: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.LIKE_SHOW, { showId });
  }
  
  /**
   * Like an episode
   */
  public async likeEpisode(episodeId: string): Promise<void> {
    await apiClient.post(ApiEndpoints.LIKE_EPISODE, undefined, { episodeId });
  }
  
  /**
   * Unlike an episode
   */
  public async unlikeEpisode(episodeId: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.LIKE_EPISODE, { episodeId });
  }
  
  /**
   * Check if user has liked a show
   */
  public async hasLikedShow(showId: string): Promise<boolean> {
    const response = await apiClient.get<{ liked: boolean }>(`/api/interaction/likes/check`, undefined, {
      params: { targetType: 'show', targetId: showId }
    });
    return response.data.liked;
  }
  
  /**
   * Check if user has liked an episode
   */
  public async hasLikedEpisode(episodeId: string): Promise<boolean> {
    const response = await apiClient.get<{ liked: boolean }>(`/api/interaction/likes/check`, undefined, {
      params: { targetType: 'episode', targetId: episodeId }
    });
    return response.data.liked;
  }
  
  /**
   * Get like count for a show
   */
  public async getShowLikeCount(showId: string): Promise<number> {
    const response = await apiClient.get<{ count: number }>(`/api/interaction/likes/count`, undefined, {
      params: { targetType: 'show', targetId: showId }
    });
    return response.data.count;
  }
  
  /**
   * Get like count for an episode
   */
  public async getEpisodeLikeCount(episodeId: string): Promise<number> {
    const response = await apiClient.get<{ count: number }>(`/api/interaction/likes/count`, undefined, {
      params: { targetType: 'episode', targetId: episodeId }
    });
    return response.data.count;
  }
  
  /**
   * Share content and generate sharing link
   */
  public async shareContent(targetType: 'show' | 'episode', targetId: string): Promise<{ shareUrl: string }> {
    const response = await apiClient.post<{ shareUrl: string }>(`/api/interaction/share`, {
      targetType,
      targetId
    });
    return response.data;
  }
}

// Export a singleton instance
export const interactionService = new InteractionService();
export default interactionService;
