'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { PlayPauseButton } from '@components/atoms/PlayPauseButton/PlayPauseButton';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface ShowCardProps {
  id: string;
  title: string;
  hostName: string;
  description: string;
  imageUrl: string;
  isLive?: boolean;
  scheduledTime?: string;
  tags?: string[];
  episodeCount?: number;
  likeCount?: number;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'featured' | 'upcoming' | 'minimal';
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

export const ShowCard: React.FC<ShowCardProps> = ({
  id,
  title,
  hostName,
  description,
  imageUrl,
  isLive = false,
  scheduledTime,
  tags = [],
  episodeCount = 0,
  likeCount = 0,
  onClick,
  className = '',
  size = 'md',
  variant = 'default',
  isPlaying = false,
  onPlayPause,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };
  
  // Image container size
  const imageContainerClasses = {
    sm: 'h-40',
    md: 'h-48',
    lg: 'h-56',
  };
  
  // Text size classes
  const titleSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };
  
  // Format scheduled time
  const formattedTime = scheduledTime 
    ? formatDistanceToNow(new Date(scheduledTime), { addSuffix: true })
    : '';
  
  // Truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  const descriptionMaxLength = size === 'sm' ? 60 : size === 'md' ? 100 : 140;
  const truncatedDescription = truncateDescription(description, descriptionMaxLength);
  
  return (
    <div 
      className={`
        flex flex-col rounded-lg overflow-hidden 
        transition-all duration-300
        ${isHovered ? 'transform scale-[1.02] shadow-xl' : 'shadow-md'}
        ${sizeClasses[size]}
        ${variant === 'featured' ? 'border-2 border-primary' : 'border border-white/10'}
        ${variant === 'minimal' ? 'bg-transparent' : 'glass'}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with overlay */}
      <div
        className={`
          relative overflow-hidden
          ${imageContainerClasses[size]}
        `}
      >
        {/* Background image */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className={`
            object-cover
            transition-transform duration-500
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}
        />
        
        {/* Overlay with gradient */}
        <div className={`
          absolute inset-0 
          bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent
          flex items-end justify-between
          p-3
        `}>
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs bg-primary/80 text-white px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-xs bg-neutral-700/80 text-white px-2 py-0.5 rounded-full">
                +{tags.length - 2}
              </span>
            )}
          </div>
          
          {/* Live indicator or scheduled time */}
          {isLive ? (
            <div className="flex items-center bg-red-600 text-white text-xs px-2 py-1 rounded">
              <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
              LIVE
            </div>
          ) : scheduledTime ? (
            <div className="text-xs text-white/80 bg-neutral-800/80 px-2 py-1 rounded">
              {formattedTime}
            </div>
          ) : null}
        </div>
        
        {/* Play button overlay */}
        <div className={`
          absolute inset-0 
          flex items-center justify-center
          transition-opacity duration-300
          ${isHovered || isPlaying ? 'opacity-100' : 'opacity-0'}
          bg-neutral-900/50
        `}>
          <PlayPauseButton
            isPlaying={isPlaying}
            onClick={onPlayPause}
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg'}
            variant="glass"
            pulseWhenPlaying={true}
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col p-4 flex-grow">
        {/* Title and host */}
        <Link href={`/shows/${id}`} className="group" onClick={onClick}>
          <h3 className={`
            font-bold
            group-hover:text-primary
            transition-colors duration-200
            ${titleSizeClasses[size]}
          `}>
            {title}
          </h3>
        </Link>
        
        <p className="text-sm text-white/60 mb-2">Host: {hostName}</p>
        
        {/* Description - not shown in minimal variant */}
        {variant !== 'minimal' && (
          <p className="text-sm text-white/80 mb-3">{truncatedDescription}</p>
        )}
        
        {/* Stats */}
        <div className="flex items-center justify-between mt-auto text-xs text-white/60">
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {episodeCount} episodes
          </div>
          
          <div className="flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {likeCount} likes
          </div>
        </div>
      </div>
      
      {/* Featured badge for featured variant */}
      {variant === 'featured' && (
        <div className="absolute top-3 right-3 bg-primary text-white text-xs px-2 py-1 rounded shadow-lg transform rotate-3 z-10">
          Featured
        </div>
      )}
    </div>
  );
};
