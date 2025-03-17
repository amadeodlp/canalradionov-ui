'use client'

import React, { useState, useRef } from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'underlined' | 'glass';
  fullWidth?: boolean;
  animated?: boolean;
  className?: string;
  inputClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  errorText,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'outline',
  fullWidth = false,
  animated = true,
  className = '',
  inputClassName = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  // Container styles based on size
  const containerSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Input padding based on size and icon presence
  const inputSizeClasses = {
    sm: `py-1 ${icon && iconPosition === 'left' ? 'pl-7 pr-2' : icon && iconPosition === 'right' ? 'pr-7 pl-2' : 'px-2'} text-sm`,
    md: `py-2 ${icon && iconPosition === 'left' ? 'pl-9 pr-3' : icon && iconPosition === 'right' ? 'pr-9 pl-3' : 'px-3'} text-base`,
    lg: `py-3 ${icon && iconPosition === 'left' ? 'pl-10 pr-4' : icon && iconPosition === 'right' ? 'pr-10 pl-4' : 'px-4'} text-lg`,
  };

  // Label positioning based on size
  const labelSizeClasses = {
    sm: 'text-xs top-1',
    md: 'text-sm top-2',
    lg: 'text-base top-3',
  };

  // Styles based on variant
  const variantClasses = {
    outline: `bg-transparent border ${error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-neutral-400'} rounded-lg`,
    filled: `${error ? 'bg-red-50 border-red-500' : isFocused ? 'bg-primary/5 border-primary' : 'bg-neutral-100 border-neutral-300'} rounded-lg`,
    underlined: `bg-transparent border-b-2 ${error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-neutral-300'} rounded-none`,
    glass: `glass border ${error ? 'border-red-500' : isFocused ? 'border-primary/60' : 'border-white/10'} rounded-lg`,
  };

  // Animation classes
  const animationClasses = animated
    ? 'transition-all duration-200'
    : '';

  // Label transform classes for floating labels
  const labelTransformClasses = (isFocused || hasValue) 
    ? `${labelSizeClasses[size]} transform -translate-y-5 scale-90 text-primary z-10`
    : `transform cursor-text ${size === 'sm' ? 'translate-y-1' : size === 'md' ? 'translate-y-2' : 'translate-y-3'} text-neutral-500`;

  // Error and helper text size
  const helperTextClasses = `mt-1 ${size === 'sm' ? 'text-xs' : 'text-sm'} ${error ? 'text-red-500' : 'text-neutral-500'}`;

  return (
    <div className={`relative ${containerSizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Floating label */}
      {label && (
        <label
          className={`absolute left-0 px-1 ml-2 pointer-events-none ${animationClasses} ${labelTransformClasses} ${error ? 'text-red-500' : isFocused ? 'text-primary' : ''}`}
          onClick={() => inputRef.current?.focus()}
        >
          {label}
          {/* Add a background color to the label when in outline or filled mode */}
          {(variant === 'outline' || variant === 'filled' || variant === 'glass') && (isFocused || hasValue) && (
            <span className="absolute inset-0 -z-10 px-1 bg-[var(--neutral-900)]" />
          )}
        </label>
      )}

      {/* Input field with icon */}
      <div className={`relative flex items-center ${variantClasses[variant]} ${animationClasses}`}>
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <div className={`absolute left-0 pl-2 flex items-center justify-center text-${error ? 'red-500' : isFocused ? 'primary' : 'neutral-500'}`}>
            {icon}
          </div>
        )}

        <input
          ref={inputRef}
          className={`w-full ${inputSizeClasses[size]} bg-transparent outline-none ${animationClasses} ${inputClassName}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Right icon */}
        {icon && iconPosition === 'right' && (
          <div className={`absolute right-0 pr-2 flex items-center justify-center text-${error ? 'red-500' : isFocused ? 'primary' : 'neutral-500'}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Error message or helper text */}
      {(error && errorText) || helperText ? (
        <p className={helperTextClasses}>
          {error && errorText ? errorText : helperText}
        </p>
      ) : null}
    </div>
  );
};
