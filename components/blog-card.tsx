'use client';
import Image from 'next/image';

interface BlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  createdAt?: string;
  loading?: boolean;
}

// BlogCard component
export default function BlogCard({ title, excerpt, image, createdAt, loading }: BlogCardProps) {
  return (
    <div
      className="flex flex-col space-y-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 w-full"
    >
      {/* Image Section */}
      <div className="w-full aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 relative">
        {loading ? (
          <div className="animate-pulse w-full h-full bg-gray-300 dark:bg-gray-700"></div>
        ) : (
          <Image
            src={image || '/images/default-image.jpg'}
            alt={title || 'Placeholder'}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        {loading ? (
          <>
            <div className="animate-pulse h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {title || 'Loading...'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
              {excerpt || 'Loading excerpt...'}
            </p>
          </>
        )}

        {/* Footer (Date) */}
        <div className="flex justify-between items-center mt-auto">
          {loading ? (
            <div className="animate-pulse h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {createdAt ? new Date(createdAt).toLocaleDateString() : 'Loading date...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}