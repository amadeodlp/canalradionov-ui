'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'minimized' | 'animated';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'default',
  className = '',
  size = 'md',
  withText = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Animation on first load
    setIsLoaded(true);
  }, []);
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  // Text size mappings
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  // Logo SVG color animation logic
  const primaryColor = isHovered ? 'var(--accent)' : 'var(--primary)';
  const secondaryColor = isHovered ? 'var(--primary-light)' : 'var(--secondary)';
  
  return (
    <Link href="/">
      <div 
        className={`flex items-center gap-3 group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* SVG Logo */}
        <div className={`relative ${sizeClasses[size]} transition-all duration-500`}>
          <svg 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            } transition-all duration-500 ${
              variant === 'animated' ? 'animate-pulse' : ''
            }`}
            style={{
              filter: isHovered 
                ? 'drop-shadow(0 0 8px var(--accent))' 
                : 'drop-shadow(0 0 4px var(--primary))'
            }}
          >
            {/* Radio Waves */}
            <path 
              d="M50 15C72.0914 15 90 32.9086 90 55C90 77.0914 72.0914 95 50 95C27.9086 95 10 77.0914 10 55C10 32.9086 27.9086 15 50 15Z" 
              stroke={primaryColor} 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray="1 8"
              className={`${isHovered ? 'animate-spin' : ''}`}
              style={{ animationDuration: '8s' }}
            />
            <path 
              d="M50 25C66.5685 25 80 38.4315 80 55C80 71.5685 66.5685 85 50 85C33.4315 85 20 71.5685 20 55C20 38.4315 33.4315 25 50 25Z" 
              stroke={secondaryColor} 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeDasharray="1 6"
              className={`${isHovered ? 'animate-spin' : ''}`}
              style={{ animationDuration: '6s', animationDirection: 'reverse' }}
            />
            
            {/* Radio Core */}
            <circle 
              cx="50" 
              cy="55" 
              r="25" 
              fill={`url(#${isHovered ? 'gradientHover' : 'gradient'})`} 
              className="transition-all duration-300"
            />
            
            {/* Radio Button */}
            <circle 
              cx="50" 
              cy="55" 
              r="8" 
              fill="var(--neutral-50)" 
              className={`transform transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            
            {/* Sound bars */}
            <rect x="42" y="35" width="3" height="10" rx="1.5" fill="var(--neutral-50)" 
              className={`transform origin-bottom transition-all duration-300 ${isHovered ? 'scale-y-150' : 'scale-y-100'}`}
            />
            <rect x="48.5" y="30" width="3" height="15" rx="1.5" fill="var(--neutral-50)" 
              className={`transform origin-bottom transition-all duration-300 ${isHovered ? 'scale-y-125' : 'scale-y-100'}`}
            />
            <rect x="55" y="35" width="3" height="10" rx="1.5" fill="var(--neutral-50)" 
              className={`transform origin-bottom transition-all duration-300 ${isHovered ? 'scale-y-150' : 'scale-y-100'}`}
            />
            
            {/* Gradients for the radio core */}
            <defs>
              <linearGradient id="gradient" x1="25" y1="30" x2="75" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--primary)" />
                <stop offset="1" stopColor="var(--secondary)" />
              </linearGradient>
              <linearGradient id="gradientHover" x1="25" y1="30" x2="75" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent)" />
                <stop offset="1" stopColor="var(--primary-light)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Logo Text */}
        {withText && (
          <div className={`flex flex-col transition-all duration-300 ${
            isHovered ? 'translate-x-1' : 'translate-x-0'
          }`}>
            <span className={`font-bold ${textSizeClasses[size]} tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary`}>
              CANAL
            </span>
            <span className={`font-black ${textSizeClasses[size]} tracking-tight -mt-2 text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary-light`}>
              RADIONOV
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
