'use client'

import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'dark' | 'light' | 'danger' | 'success' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isFullWidth?: boolean;
  withRipple?: boolean;
  isGlowing?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isFullWidth = false,
  withRipple = true,
  isGlowing = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}) => {
  const [rippleStyle, setRippleStyle] = useState<React.CSSProperties | null>(null);
  const [isRippling, setIsRippling] = useState(false);

  // Base class for all buttons
  const baseClasses = `
    relative 
    flex 
    items-center 
    justify-center 
    font-medium 
    transition-all 
    duration-200
    outline-none
    overflow-hidden
    ${isFullWidth ? 'w-full' : ''}
    ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-[1.02] active:scale-[0.98]'}
  `;

  // Size variations
  const sizeClasses = {
    xs: 'text-xs px-2 py-1 rounded-md',
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-base px-4 py-2 rounded-lg',
    lg: 'text-lg px-5 py-2.5 rounded-lg',
    xl: 'text-xl px-6 py-3 rounded-xl',
  };

  // Variant styles
  const variantClasses = {
    primary: `bg-gradient-to-r from-primary to-primary-dark text-white ${isGlowing ? 'shadow-md shadow-primary/40' : ''}`,
    secondary: `bg-gradient-to-r from-secondary to-secondary-dark text-white ${isGlowing ? 'shadow-md shadow-secondary/40' : ''}`,
    accent: `bg-gradient-to-r from-accent to-accent-dark text-neutral-900 ${isGlowing ? 'shadow-md shadow-accent/40' : ''}`,
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-primary hover:bg-primary/10',
    dark: 'bg-neutral-800 text-white hover:bg-neutral-700',
    light: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
    glass: 'glass text-white backdrop-blur-md'
  };

  // Handle ripple effect
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!withRipple || props.disabled) return;
    
    const button = e.currentTarget;
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;
    
    setRippleStyle({
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${x}px`,
      top: `${y}px`,
    });
    
    setIsRippling(true);
    
    // Remove ripple after animation
    setTimeout(() => {
      setIsRippling(false);
    }, 600);
  };

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
    ${isGlowing ? `${variant === 'primary' ? 'glow-primary' : variant === 'secondary' ? 'glow-secondary' : 'glow'}` : ''}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={isLoading || props.disabled}
      onClick={(e) => {
        handleRipple(e);
        props.onClick?.(e);
      }}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit z-10">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      
      {/* Left icon */}
      {leftIcon && <span className={`mr-2 ${isLoading ? 'opacity-0' : ''}`}>{leftIcon}</span>}
      
      {/* Button content */}
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      
      {/* Right icon */}
      {rightIcon && <span className={`ml-2 ${isLoading ? 'opacity-0' : ''}`}>{rightIcon}</span>}
      
      {/* Ripple effect */}
      {isRippling && withRipple && (
        <span 
          className="absolute rounded-full bg-white/30 animate-ripple" 
          style={rippleStyle || {}}
        ></span>
      )}
    </button>
  );
};
