"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const TooltipBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000); // Hide after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 text-sm font-medium flex justify-between items-center">
      <div className="flex-1 text-center">
        Limited offer: Get 1 free project generation by signing up now!
      </div>
      <Link href="/sign-up" className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors duration-200">
        Sign Up
      </Link>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  );
};

export default TooltipBanner;
