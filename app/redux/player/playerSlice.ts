import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RadioShow, Episode } from '@api/services/mediaService';

// Define player state types
export interface PlayerState {
  isOpen: boolean;
  currentShowId: string | null;
  currentEpisodeId: string | null;
  currentShow: RadioShow | null;
  currentEpisode: Episode | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  playQueue: Array<{
    showId: string;
    episodeId?: string;
  }>;
  error: string | null;
}

const initialState: PlayerState = {
  isOpen: false,
  currentShowId: null,
  currentEpisodeId: null,
  currentShow: null,
  currentEpisode: null,
  isPlaying: false,
  isLoading: false,
  volume: 80,
  playQueue: [],
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // Play a show (live or latest episode)
    playShow: (state, action: PayloadAction<RadioShow>) => {
      const show = action.payload;
      
      state.currentShowId = show.id;
      state.currentShow = show;
      state.currentEpisodeId = null;
      state.currentEpisode = null;
      state.isPlaying = true;
      state.isOpen = true;
      state.isLoading = true;
      state.error = null;
    },
    
    // Play a specific episode
    playEpisode: (state, action: PayloadAction<{ show: RadioShow; episode: Episode }>) => {
      const { show, episode } = action.payload;
      
      state.currentShowId = show.id;
      state.currentShow = show;
      state.currentEpisodeId = episode.id;
      state.currentEpisode = episode;
      state.isPlaying = true;
      state.isOpen = true;
      state.isLoading = true;
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Toggle play/pause
    togglePlayPause: (state) => {
      if (state.currentShowId) {
        state.isPlaying = !state.isPlaying;
      }
    },
    
    // Set playing state directly
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    
    // Set volume
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    
    // Stop playback and clear current show/episode
    stop: (state) => {
      state.isPlaying = false;
    },
    
    // Close the player
    closePlayer: (state) => {
      state.isOpen = false;
      state.isPlaying = false;
    },
    
    // Open the player
    openPlayer: (state) => {
      state.isOpen = true;
    },
    
    // Add item to play queue
    addToQueue: (state, action: PayloadAction<{ showId: string; episodeId?: string }>) => {
      state.playQueue.push(action.payload);
    },
    
    // Remove item from play queue
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.playQueue.splice(action.payload, 1);
    },
    
    // Clear the play queue
    clearQueue: (state) => {
      state.playQueue = [];
    },
    
    // Play next item in queue
    playNext: (state) => {
      if (state.playQueue.length > 0) {
        const nextItem = state.playQueue.shift();
        if (nextItem) {
          state.currentShowId = nextItem.showId;
          state.currentEpisodeId = nextItem.episodeId || null;
          state.isPlaying = true;
          state.isLoading = true;
        }
      } else {
        // No more items in queue
        state.isPlaying = false;
      }
    },
    
    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  playShow,
  playEpisode,
  setLoading,
  togglePlayPause,
  setPlaying,
  setVolume,
  stop,
  closePlayer,
  openPlayer,
  addToQueue,
  removeFromQueue,
  clearQueue,
  playNext,
  setError,
} = playerSlice.actions;

export default playerSlice.reducer;
