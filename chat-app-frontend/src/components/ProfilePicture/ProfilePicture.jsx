import React from 'react';

const ProfilePicture = ({ src, alt, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',    // Small, for chat list
    md: 'w-10 h-10 text-base', // Medium, for chat window header
    lg: 'w-24 h-24 text-xl',   // Large, for profile page
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover ${sizeClasses[size]}`}
    />
  );
};

export default ProfilePicture;