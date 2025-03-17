'use client'

import React, { useState } from 'react';
import { ShowCard } from '@components/Molecules/ShowCard/ShowCard';
import { RadioShow } from '@api/services/mediaService';
import { Button } from '@components/atoms/Button/Button';

interface ShowGridProps {
  shows: RadioShow[];
  title?: string;
  showCount?: number;
  initialShowCount?: number;
  loadMoreIncrement?: number;
  showLoadMore?: boolean;
  cardSize?: 'sm' | 'md' | 'lg';
  cardVariant?: 'default' | 'featured' | 'upcoming' | 'minimal';
  className?: string;
  emptyMessage?: string;
  onShowSelect?: (show: RadioShow) => void;
  onPlay?: (show: RadioShow) => void;
  featuredIndex?: number;
}

export const ShowGrid: React.FC<ShowGridProps> = ({
  shows,
  title,
  showCount,
  initialShowCount = 8,
  loadMoreIncrement = 8,
  showLoadMore = true,
  cardSize = 'md',
  cardVariant = 'default',
  className = '',
  emptyMessage = 'No shows available',
  onShowSelect,
  onPlay,
  featuredIndex,
}) => {
  const [displayCount, setDisplayCount] = useState(initialShowCount);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  // Filter shows if showCount is specified
  const displayedShows = showCount ? shows.slice(0, showCount) : shows.slice(0, displayCount);
  
  // Handle load more button click
  const handleLoadMore = () => {
    setDisplayCount(Math.min(displayCount + loadMoreIncrement, shows.length));
  };
  
  // Handle play button click
  const handlePlay = (show: RadioShow) => {
    if (currentlyPlaying === show.id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(show.id);
    }
    
    if (onPlay) {
      onPlay(show);
    }
  };
  
  // Get grid column count based on screen size
  const gridColClasses = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6';
  
  return (
    <div className={`w-full ${className}`}>
      {/* Section title */}
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {!showLoadMore && shows.length > initialShowCount && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => onShowSelect && onShowSelect(shows[0])}
            >
              View All
            </Button>
          )}
        </div>
      )}
      
      {/* Empty state */}
      {shows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 text-neutral-500">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-xl text-neutral-400">{emptyMessage}</p>
        </div>
      )}
      
      {/* Shows grid */}
      {shows.length > 0 && (
        <div className={gridColClasses}>
          {displayedShows.map((show, index) => (
            <ShowCard
              key={show.id}
              id={show.id}
              title={show.title}
              hostName={show.hostName}
              description={show.description}
              imageUrl={show.imageUrl}
              isLive={show.isLive}
              scheduledTime={show.scheduledTime}
              tags={show.tags}
              episodeCount={show.episodes?.length || 0}
              likeCount={0} // Would come from a separate API call
              size={cardSize}
              variant={index === featuredIndex ? 'featured' : cardVariant}
              isPlaying={currentlyPlaying === show.id}
              onPlayPause={() => handlePlay(show)}
              onClick={() => onShowSelect && onShowSelect(show)}
            />
          ))}
        </div>
      )}
      
      {/* Load more button */}
      {showLoadMore && shows.length > displayCount && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};
