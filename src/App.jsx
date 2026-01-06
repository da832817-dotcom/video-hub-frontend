import React, { useState, useMemo } from "react";
import VideoGrid from "./components/VideoGrid";
import VideoCard from "./components/VideoCard";
import debounce from "lodash.debounce";
import { apiService } from "./services/api";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [type, setType] = useState("youtube");
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("en");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const debouncedSearch = useMemo(
    () => debounce((value) => setQuery(value), 600),
    []
  );

  const fetchFavorites = async () => {
    try {
      const data = await apiService.getFavorites();
      setFavorites(data);
      setShowFavorites(true);
    } catch (error) {
      console.error("Favorites load fail:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="bottom-center" />
      
      <div className="max-w-7xl mx-auto w-full p-3 md:p-8 flex flex-col flex-grow">
        
        {/* Header Section */}
        <div className="text-center mb-4 md:mb-6 shrink-0">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600 mb-2">
            Video Hub
          </h1>
          <button
            onClick={showFavorites ? () => setShowFavorites(false) : fetchFavorites}
            className={`px-5 py-2 rounded-full text-sm md:text-base font-bold transition shadow-md ${
              showFavorites ? "bg-gray-800 text-white" : "bg-yellow-500 text-black hover:bg-yellow-600"
            }`}
          >
            {showFavorites ? "⬅ Back to Search" : "⭐ My Favorites"}
          </button>
        </div>

        {!showFavorites ? (
          <div className="flex flex-col flex-grow">
            {/* Platform Selection - Mobile Friendly */}
            <div className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-6">
              <button
                onClick={() => setType("youtube")}
                className={`flex-1 md:flex-none md:px-10 py-2.5 md:py-3 rounded-xl md:rounded-full text-sm md:text-lg font-bold transition-all ${
                  type === "youtube" ? "bg-red-600 text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                📺 YouTube
              </button>
              <button
                onClick={() => setType("dailymotion")}
                className={`flex-1 md:flex-none md:px-10 py-2.5 md:py-3 rounded-xl md:rounded-full text-sm md:text-lg font-bold transition-all ${
                  type === "dailymotion" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-700 border border-gray-200"
                }`}
              >
                🎬 Dailymotion
              </button>
            </div>

            {/* Search & Select - Mobile Stacked */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 bg-white p-3 md:p-4 rounded-2xl shadow-sm">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full flex-grow px-4 py-2.5 md:px-6 md:py-3 border border-gray-100 bg-gray-50 rounded-xl outline-none focus:border-red-500 transition-colors"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
              <select
                className="w-full md:w-48 px-4 py-2.5 md:py-3 border border-gray-100 bg-gray-50 rounded-xl outline-none"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 Hindi / Urdu</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="ar">🇦🇪 Arabic</option>
              </select>
            </div>

            {/* Video Grid Area */}
            <div className="flex-grow bg-white rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-sm">
              <VideoGrid key={`${type}-${lang}-${query}`} type={type} query={query} lang={lang} />
            </div>
          </div>
        ) : (
          /* Favorites Area */
          <div className="flex-grow bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Saved Videos ❤️</h2>
            {favorites.length === 0 ? (
              <p className="text-gray-400 text-center py-20">No Video Saved</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {favorites.map((fav) => (
                  <VideoCard
                    key={fav.id}
                    type={fav.platform}
                    video={{
                      video_id: fav.video_id,
                      title: fav.title,
                      thumbnail: fav.thumbnail,
                    }}
                    isFavoriteView={true}
                    refreshFavorites={fetchFavorites}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}