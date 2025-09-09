import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <svg 
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 463 410"
      className={cn(sizeClasses[size], className)}
    >
      {/* CultureCart Logo SVG content will be inserted here */}
      <g fill="currentColor">
        {/* This is a placeholder - we'll need to copy the actual SVG paths from your logo.svg */}
        <path d="M231.5 50c-50 0-90 40-90 90s40 90 90 90 90-40 90-90-40-90-90-90zm0 150c-33.1 0-60-26.9-60-60s26.9-60 60-60 60 26.9 60 60-26.9 60-60 60z"/>
        <path d="M231.5 200c-50 0-90 40-90 90s40 90 90 90 90-40 90-90-40-90-90-90zm0 150c-33.1 0-60-26.9-60-60s26.9-60 60-60 60 26.9 60 60-26.9 60-60 60z"/>
      </g>
    </svg>
  );
};
