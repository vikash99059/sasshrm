import React from 'react';

interface Hrm3dLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Hrm3dLogo: React.FC<Hrm3dLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(37,99,235,0.35)]"
      >
        <defs>
          {/* Hexagon Outer Gradient */}
          <linearGradient id="hexOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="35%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          {/* 3D Cube Top Face (Cyan / White Highlight) */}
          <linearGradient id="cubeTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>

          {/* 3D Cube Left Face (Vibrant Sky Blue) */}
          <linearGradient id="cubeLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* 3D Cube Right Face (Deep Navy Blue) */}
          <linearGradient id="cubeRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Rounded Hexagon Outer Base */}
        <path
          d="M50 4 
             L88 26 
             A6 6 0 0 1 91 31
             L91 69 
             A6 6 0 0 1 88 74 
             L50 96 
             A6 6 0 0 1 44 96
             L12 74 
             A6 6 0 0 1 9 69 
             L9 31 
             A6 6 0 0 1 12 26 
             L44 4 
             A6 6 0 0 1 50 4 Z"
          fill="url(#hexOuterGrad)"
        />

        {/* Central Isometric 3D Floating White/Blue Cube */}
        <g transform="translate(50, 50)">
          {/* Top Diamond Face */}
          <path
            d="M0 -22 L19 -11 L0 0 L-19 -11 Z"
            fill="url(#cubeTopGrad)"
            opacity="0.95"
          />
          {/* Left Vertical Face */}
          <path
            d="M-19 -11 L0 0 L0 22 L-19 11 Z"
            fill="url(#cubeLeftGrad)"
            opacity="0.9"
          />
          {/* Right Vertical Face */}
          <path
            d="M0 0 L19 -11 L19 11 L0 22 Z"
            fill="url(#cubeRightGrad)"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
};
