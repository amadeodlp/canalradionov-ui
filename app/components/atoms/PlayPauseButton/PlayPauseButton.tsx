'use client'

import React, { useState } from 'react';

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent' | 'white' | 'glass';
  isLoading?: boolean;
  pulseWhenPlaying?: boolean;
  className?: string;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
  size = 'md',
  variant = 'primary',
  isLoading = false,
  pulseWhenPlaying = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };
  
  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };
  
  // Variant mappings
  const variantClasses = {
    primary: `bg-primary hover:bg-primary-dark text-white ${isPlaying && pulseWhenPlaying ? 'shadow-[0_0_15px_rgba(108,17,255,0.6)]' : ''}`,
    secondary: `bg-secondary hover:bg-secondary-dark text-white ${isPlaying && pulseWhenPlaying ? 'shadow-[0_0_15px_rgba(255,41,117,0.6)]' : ''}`,
    accent: `bg-accent hover:bg-accent-dark text-neutral-900 ${isPlaying && pulseWhenPlaying ? 'shadow-[0_0_15px_rgba(0,238,255,0.6)]' : ''}`,
    white: `bg-white hover:bg-neutral-100 text-neutral-900 ${isPlaying && pulseWhenPlaying ? 'shadow-[0_0_15px_rgba(255,255,255,0.6)]' : ''}`,
    glass: `glass backdrop-blur-md text-white border border-white/10 ${isPlaying && pulseWhenPlaying ? 'shadow-[0_0_15px_rgba(255,255,255,0.2)]' : ''}`,
  };
  
  // Animation states
  const getAnimationClass = () => {
    if (isLoading) return 'scale-95';
    if (isPressed) return 'scale-90';
    if (isHovered) return 'scale-110';
    return 'scale-100';
  };
  
  return (
    <button
      className={`
        relative rounded-full flex items-center justify-center
        transition-all duration-300 transform
        ${getAnimationClass()}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isPlaying && pulseWhenPlaying ? 'animate-pulse' : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={isLoading}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isLoading ? (
        // Loading spinner
        <div className="animate-spin">
          <svg className={`${iconSizeClasses[size]}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <div className="relative">
          {/* Play Icon - shown when not playing */}
          <svg
            className={`${iconSizeClasses[size]} transition-all duration-300 transform ${
              isPlaying ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ position: isPlaying ? 'absolute' : 'relative', top: 0, left: 0 }}
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          
          {/* Pause Icon - shown when playing */}
          <svg
            className={`${iconSizeClasses[size]} transition-all duration-300 transform ${
              isPlaying ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'
            }`}
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ position: !isPlaying ? 'absolute' : 'relative', top: 0, left: 0 }}
          >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </div>
      )}
      
      {/* Ripple effect when playing */}
      {isPlaying && pulseWhenPlaying && (
        <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current pointer-events-none"></span>
      )}
    </button>
  );
};
