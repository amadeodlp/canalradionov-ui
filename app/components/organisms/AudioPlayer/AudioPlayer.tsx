'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { PlayPauseButton } from '@components/atoms/PlayPauseButton/PlayPauseButton';
import { AudioVisualizer } from '@components/atoms/AudioVisualizer/AudioVisualizer';
import { Toast } from "@components/Molecules/Toast/Toast";
import mediaService from '@api/services/mediaService';

interface AudioPlayerProps {
  showId?: string;
  episodeId?: string;
  streamUrl?: string;
  showTitle?: string;
  hostName?: string;
  showImage?: string;
  isLive?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  showId,
  episodeId,
  streamUrl,
  showTitle = 'Canal Radionov',
  hostName = 'Live Host',
  showImage = "/assets/default-show.jpg",
  isLive = false,
  autoPlay = false,
  className = '',
}) => {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [audioSrc, setAudioSrc] = useState(streamUrl || '');
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Load episode or show data if IDs are provided
  useEffect(() => {
    const fetchMediaData = async () => {
      if (!streamUrl && (showId || episodeId)) {
        setLoading(true);
        try {
          if (episodeId && showId) {
            // Load specific episode
            const episode = await mediaService.getEpisode(showId, episodeId);
            setAudioSrc(episode.audioUrl);
            setShowTitle(episode.title);
            if (episode.imageUrl) {
              setShowImage(episode.imageUrl);
            }
            setIsLive(false);
          } else if (showId) {
            // Load show (assumes it's for streaming live content)
            const show = await mediaService.getShowById(showId);
            if (show.isLive) {
              // For a live show, we would have a streaming URL
              // This would be specific to your streaming setup
              setAudioSrc(`https://streaming.canalradionov.com/live/${show.id}`);
              setShowTitle(show.title);
              setHostName(show.hostName);
              setShowImage(show.imageUrl);
              setIsLive(true);
            } else {
              // If not live but has episodes, play the latest episode
              if (show.episodes && show.episodes.length > 0) {
                const latestEpisode = show.episodes[0]; // Assuming episodes are sorted newest first
                setAudioSrc(latestEpisode.audioUrl);
                setShowTitle(`${show.title} - ${latestEpisode.title}`);
                setIsLive(false);
              } else {
                throw new Error('No content available for this show');
              }
            }
          }
        } catch (error) {
          console.error('Error loading media:', error);
          setToastState({ 
            open: true, 
            variant: "error", 
            message: "Unable to load media content" 
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchMediaData();
  }, [showId, episodeId, streamUrl]);
  
  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const handleLoadStart = () => setLoading(true);
    
    const handleCanPlay = () => {
      setLoading(false);
      setDuration(audio.duration);
      if (autoPlay) {
        audio.play().catch(e => console.error('Autoplay failed:', e));
      }
    };
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    
    const handlePlay = () => {
      setIsPlaying(true);
      setShowAnimation(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      setShowAnimation(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setShowAnimation(false);
      setCurrentTime(0);
      
      // For live streams, try to reconnect
      if (isLive) {
        setTimeout(() => {
          audio.load();
          audio.play().catch(e => console.error('Reconnect failed:', e));
        }, 1000);
      }
    };
    
    const handleError = () => {
      setLoading(false);
      setToastState({ 
        open: true, 
        variant: "error", 
        message: "There was an error playing this audio" 
      });
    };
    
    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Increment play count when starting to play a non-live episode
    if (showId && episodeId && !isLive) {
      audio.addEventListener('play', async () => {
        try {
          await mediaService.incrementPlayCount(showId, episodeId);
        } catch (error) {
          console.error('Failed to increment play count:', error);
        }
      }, { once: true }); // Only trigger once per episode
    }
    
    // Clean up event listeners
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef, autoPlay, showId, episodeId, isLive]);
  
  // Update audio source when it changes
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.load();
    }
  }, [audioSrc]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        setToastState({ 
          open: true, 
          variant: "error", 
          message: "Unable to play audio" 
        });
      });
    }
  };
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  };
  
  // Handle progress bar click for seeking
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || isLive) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Toggle expanded view
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Determine if we should show the seek bar
  const showSeekBar = !isLive && duration > 0;
  
  return (
    <div 
      ref={playerRef}
      className={`
        fixed bottom-0 left-0 right-0 
        transition-all duration-500 ease-in-out
        ${isExpanded ? 'h-80' : 'h-20'} 
        glass-dark backdrop-blur-xl border-t border-white/10
        ${className}
      `}
    >
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Expand/Collapse button */}
      <button
        onClick={toggleExpand}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  w-10 h-5 bg-neutral-800 rounded-t-xl border-t border-l border-r border-white/10
                  flex items-center justify-center text-white/60 hover:text-white"
        aria-label={isExpanded ? "Collapse player" : "Expand player"}
      >
        <svg
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L6 5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      
      {/* Minimized Player */}
      <div className={`
        flex items-center justify-between px-4 h-20 w-full
        ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        transition-opacity duration-300
      `}>
        {/* Album art & info */}
        <div className="flex items-center space-x-4 w-1/3">
          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={showImage}
              alt={showTitle}
              fill
              className="object-cover"
            />
            {isLive && (
              <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1 rounded">
                LIVE
              </div>
            )}
          </div>
          
          <div className="truncate">
            <h3 className="text-sm font-semibold truncate">{showTitle}</h3>
            <p className="text-xs text-white/60 truncate">Host: {hostName}</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-4 justify-center">
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={togglePlayPause}
            isLoading={loading}
            size="sm"
            variant="glass"
          />
          
          {showSeekBar && (
            <div className="hidden md:flex items-center space-x-2 w-48">
              <span className="text-xs text-white/60 w-10 text-right">{formatTime(currentTime)}</span>
              <div 
                ref={progressBarRef}
                className="relative h-1 bg-neutral-700 rounded-full flex-grow cursor-pointer"
                onClick={handleProgressBarClick}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-white/60 w-10">{formatTime(duration)}</span>
            </div>
          )}
          
          {isLive && (
            <div className="hidden md:flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-600 mr-2 animate-pulse"></div>
              <span className="text-xs text-white/60">Live</span>
            </div>
          )}
        </div>
        
        {/* Volume & Options */}
        <div className="flex items-center space-x-4 justify-end w-1/3">
          <div className="relative">
            <button
              className="text-white/60 hover:text-white"
              onClick={() => setIsVolumeVisible(!isVolumeVisible)}
              aria-label="Volume"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 14H3C2.44772 14 2 13.5523 2 13V11C2 10.4477 2.44772 10 3 10H5.5L10.6713 5.32875C11.0341 5.00729 11.592 5.00729 11.9548 5.32875C12.3176 5.65021 12.3176 6.1528 11.9548 6.47426L7.5 11V13L11.9548 17.5257C12.3176 17.8472 12.3176 18.3498 11.9548 18.6713C11.592 18.9927 11.0341 18.9927 10.6713 18.6713L5.5 14Z" fill="currentColor" />
                <path d="M15 22C14.5858 22 14.25 21.6642 14.25 21.25C14.25 20.8358 14.5858 20.5 15 20.5C18.7279 20.5 21.75 17.4779 21.75 13.75C21.75 10.0221 18.7279 7 15 7C14.5858 7 14.25 6.66421 14.25 6.25C14.25 5.83579 14.5858 5.5 15 5.5C19.5563 5.5 23.25 9.19365 23.25 13.75C23.25 18.3063 19.5563 22 15 22Z" fill="currentColor" />
                <path d="M15 18C14.5858 18 14.25 17.6642 14.25 17.25C14.25 16.8358 14.5858 16.5 15 16.5C16.5188 16.5 17.75 15.2688 17.75 13.75C17.75 12.2312 16.5188 11 15 11C14.5858 11 14.25 10.6642 14.25 10.25C14.25 9.83579 14.5858 9.5 15 9.5C17.3472 9.5 19.25 11.4028 19.25 13.75C19.25 16.0972 17.3472 18 15 18Z" fill="currentColor" />
              </svg>
            </button>
            
            {isVolumeVisible && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 glass rounded-lg">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Player */}
      <div className={`
        flex flex-col items-center justify-center h-full px-4 py-8
        ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        transition-opacity duration-300
      `}>
        <div className="flex flex-col items-center justify-start w-full max-w-2xl">
          {/* Album Art (Large) */}
          <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-lg overflow-hidden mb-6">
            <Image
              src={showImage}
              alt={showTitle}
              fill
              className="object-cover"
            />
            {isLive && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
                LIVE
              </div>
            )}
          </div>
          
          {/* Show/Episode Info */}
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold">{showTitle}</h2>
            <p className="text-white/60">{hostName}</p>
          </div>
          
          {/* Audio Visualizer */}
          <div className="w-full h-16 mb-6">
            <AudioVisualizer 
              audioRef={audioRef}
              isPlaying={isPlaying}
              variant="wave"
              animationSpeed="normal"
              height={64}
              sensitivity={1.5}
            />
          </div>
          
          {/* Progress Bar (for non-live content) */}
          {showSeekBar && (
            <div className="w-full flex items-center space-x-3 mb-6">
              <span className="text-sm text-white/60">{formatTime(currentTime)}</span>
              
              <div className="flex-grow">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>
              
              <span className="text-sm text-white/60">{formatTime(duration)}</span>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-8">
            {/* Previous Track (disabled for live) */}
            <button 
              className={`text-white/60 hover:text-white ${isLive ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={isLive}
              aria-label="Previous track"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7071 5.29289C18.0976 5.68342 18.0976 6.31658 17.7071 6.70711L12.4142 12L17.7071 17.2929C18.0976 17.6834 18.0976 18.3166 17.7071 18.7071C17.3166 19.0976 16.6834 19.0976 16.2929 18.7071L10.2929 12.7071C9.90237 12.3166 9.90237 11.6834 10.2929 11.2929L16.2929 5.29289C16.6834 4.90237 17.3166 4.90237 17.7071 5.29289Z" fill="currentColor" />
                <path d="M6 6C6 5.44772 6.44772 5 7 5C7.55228 5 8 5.44772 8 6V18C8 18.5523 7.55228 19 7 19C6.44772 19 6 18.5523 6 18V6Z" fill="currentColor" />
              </svg>
            </button>
            
            {/* Play/Pause Button (Large) */}
            <PlayPauseButton
              isPlaying={isPlaying}
              onClick={togglePlayPause}
              isLoading={loading}
              size="lg"
              variant="primary"
              pulseWhenPlaying={true}
            />
            
            {/* Next Track (disabled for live) */}
            <button 
              className={`text-white/60 hover:text-white ${isLive ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={isLive}
              aria-label="Next track"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.29289 5.29289C6.68342 4.90237 7.31658 4.90237 7.70711 5.29289L13.7071 11.2929C14.0976 11.6834 14.0976 12.3166 13.7071 12.7071L7.70711 18.7071C7.31658 19.0976 6.68342 19.0976 6.29289 18.7071C5.90237 18.3166 5.90237 17.6834 6.29289 17.2929L11.5858 12L6.29289 6.70711C5.90237 6.31658 5.90237 5.68342 6.29289 5.29289Z" fill="currentColor" />
                <path d="M16 6C16 5.44772 16.4477 5 17 5C17.5523 5 18 5.44772 18 6V18C18 18.5523 17.5523 19 17 19C16.4477 19 16 18.5523 16 18V6Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center space-x-4 mt-8">
            <button 
              className="text-white/60 hover:text-white"
              onClick={() => setVolume(volume > 0 ? 0 : 80)}
              aria-label={volume > 0 ? "Mute" : "Unmute"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 14H3C2.44772 14 2 13.5523 2 13V11C2 10.4477 2.44772 10 3 10H5.5L10.6713 5.32875C11.0341 5.00729 11.592 5.00729 11.9548 5.32875C12.3176 5.65021 12.3176 6.1528 11.9548 6.47426L7.5 11V13L11.9548 17.5257C12.3176 17.8472 12.3176 18.3498 11.9548 18.6713C11.592 18.9927 11.0341 18.9927 10.6713 18.6713L5.5 14Z" fill="currentColor" />
                {volume > 0 ? (
                  <>
                    <path d="M15 22C14.5858 22 14.25 21.6642 14.25 21.25C14.25 20.8358 14.5858 20.5 15 20.5C18.7279 20.5 21.75 17.4779 21.75 13.75C21.75 10.0221 18.7279 7 15 7C14.5858 7 14.25 6.66421 14.25 6.25C14.25 5.83579 14.5858 5.5 15 5.5C19.5563 5.5 23.25 9.19365 23.25 13.75C23.25 18.3063 19.5563 22 15 22Z" fill="currentColor" />
                    <path d="M15 18C14.5858 18 14.25 17.6642 14.25 17.25C14.25 16.8358 14.5858 16.5 15 16.5C16.5188 16.5 17.75 15.2688 17.75 13.75C17.75 12.2312 16.5188 11 15 11C14.5858 11 14.25 10.6642 14.25 10.25C14.25 9.83579 14.5858 9.5 15 9.5C17.3472 9.5 19.25 11.4028 19.25 13.75C19.25 16.0972 17.3472 18 15 18Z" fill="currentColor" />
                  </>
                ) : null}
              </svg>
            </button>
            
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-36 h-2 bg-neutral-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <Toast
        message={toastState.message}
        isOpen={toastState.open}
        variant={toastState.variant}
        onClose={() => setToastState({ ...toastState, open: false })}
      />
    </div>
  );
};
