import React, { useEffect, useState, useCallback } from "react";
import { apiService } from "../services/api"; // Updated path to service
import VideoCard from "./VideoCard";
import SkeletonCard from "./SkeletonCard";

export default function VideoGrid({ type, query, lang }) {
  const [videos, setVideos] = useState([]);
  const [nextPage, setNextPage] = useState(type === "youtube" ? "" : 1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Yeh function data load karega
  const loadData = useCallback(async (isInitial = false) => {
    if (loading) return; 
    
    setLoading(true);
    
    // Logic for page and search term
    const currentPage = isInitial ? (type === "youtube" ? "" : 1) : nextPage;
    const searchTerm = query.trim() === "" ? "trending" : query;

    try {
      let data;
      if (type === "youtube") {
        // Using apiService for YouTube
        data = await apiService.getYouTubeVideos(searchTerm, currentPage, lang);
        const newItems = data.items || [];
        setVideos(prev => isInitial ? newItems : [...prev, ...newItems]);
        setNextPage(data.nextPageToken || "");
        setHasMore(!!data.nextPageToken);
      } else {
        // Using apiService for Dailymotion
        data = await apiService.getDailymotionVideos(currentPage, searchTerm, lang);
        const newItems = data.list || [];
        setVideos(prev => isInitial ? newItems : [...prev, ...newItems]);
        setNextPage(prev => isInitial ? 2 : prev + 1);
        setHasMore(data.has_more || false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, query, lang, nextPage, loading]); // loading aur nextPage dependancies check karein

  // Reset logic when Type, Query, or Lang changes
  useEffect(() => {
    setVideos([]);
    setHasMore(true);
    setNextPage(type === "youtube" ? "" : 1);
    
    loadData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, query, lang]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Infinite scroll check
    if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && hasMore) {
      loadData(false);
    }
  };

  return (
    <div onScroll={handleScroll} className="h-full overflow-y-auto px-2 border border-gray-100 rounded-xl custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
        {/* Actual Videos */}
        {videos.map((v, i) => (
          <VideoCard key={`${type}-${v.id}-${i}`} type={type} video={v} />
        ))}

        {/* Loading Skeletons */}
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </div>

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-4">🔍</span>
          <p className="font-medium text-lg">No videos found for "{query}"</p>
          <p className="text-sm">Try changing keywords or language.</p>
        </div>
      )}
    </div>
  );
}