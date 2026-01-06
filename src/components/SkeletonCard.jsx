import React from "react";

export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
      <div className="h-48 bg-gray-300 dark:bg-gray-600" />
      <div className="p-2 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
      </div>
    </div>
  );
}
