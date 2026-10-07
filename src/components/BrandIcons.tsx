import React from 'react';

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const BkashIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#E2136E" />
    <path
      d="M34.2 14L47 28.5L38.5 35.8L34.2 14Z"
      fill="#FFFFFF"
      fillOpacity="0.95"
    />
    <path
      d="M34.2 14L18 29.2L31 32.8L34.2 14Z"
      fill="#FFFFFF"
    />
    <path
      d="M18 29.2L28.5 50L35 37.5L18 29.2Z"
      fill="#FFFFFF"
      fillOpacity="0.85"
    />
    <path
      d="M47 28.5L34 40.5L38.5 35.8L47 28.5Z"
      fill="#FFFFFF"
      fillOpacity="0.75"
    />
  </svg>
);

export const NagadIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#F7941D" />
    <circle cx="32" cy="32" r="18" fill="#D32F2F" />
    <path
      d="M26 22H33C37.4183 22 41 25.5817 41 30C41 34.4183 37.4183 38 33 38H30V43H26V22ZM30 34H33C35.2091 34 37 32.2091 37 30C37 27.7909 35.2091 26 33 26H30V34Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const RocketIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#8C338C" />
    <path
      d="M32 16L39 28H25L32 16Z"
      fill="#FFFFFF"
    />
    <path
      d="M27 28H37V42H27V28Z"
      fill="#FFFFFF"
    />
    <path
      d="M22 36L27 34V44L22 48V36Z"
      fill="#FFD200"
    />
    <path
      d="M42 36L37 34V44L42 48V36Z"
      fill="#FFD200"
    />
    <path
      d="M29 44L32 50L35 44H29Z"
      fill="#FF4444"
    />
  </svg>
);
