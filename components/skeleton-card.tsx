import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
      {/* Image Placeholder with Correct Aspect Ratio */}
      <div className="w-full aspect-w-16 aspect-h-9 bg-gray-300 dark:bg-gray-700"></div>
      
      {/* Card Content Placeholder */}
      <div className="p-6 flex flex-col flex-grow space-y-3">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        
        {/* Excerpt Placeholder */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        
        {/* Date and Read More Placeholder */}
        <div className="flex justify-between items-center mt-auto">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/6"></div>
        </div>
      </div>
    </div>
  );
}
