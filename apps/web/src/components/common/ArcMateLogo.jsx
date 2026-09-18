import React from 'react';

export default function ArcMateLogo({ className = "w-8 h-8", size }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="arcBgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ed6f5c" />
          <stop offset="100%" stopColor="#d95340" />
        </linearGradient>
        <radialGradient id="arcDomeGrad" cx="50" cy="92" r="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="42%" stopColor="#fdf5ec" stopOpacity="0.85" />
          <stop offset="72%" stopColor="#f0a89b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ed6f5c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="26" fill="url(#arcBgGrad)" />
      <rect x="4.5" y="4.5" width="91" height="91" rx="25.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M 12 96 C 12 52, 28 32, 50 32 C 72 32, 88 52, 88 96 Z" fill="url(#arcDomeGrad)" />
      <ellipse cx="44" cy="58" rx="7.5" ry="10.5" fill="#ffffff" transform="rotate(-10 44 58)" />
      <ellipse cx="64" cy="54" rx="7.5" ry="10.5" fill="#ffffff" transform="rotate(-5 64 54)" />
    </svg>
  );
}