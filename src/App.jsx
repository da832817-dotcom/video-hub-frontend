import React, { useState, useMemo } from "react";
import VideoGrid from "./components/VideoGrid";
import VideoCard from "./components/VideoCard";
import debounce from "lodash.debounce";
import { apiService } from "./services/api"; // Import lazmi check karein
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
    // Flex-col aur h-screen se layout fix hoga
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
      <Toaster position="bottom-center" />
      
      <div className="max-w-7xl mx-auto w-full p-4 md:p-8 flex flex-col h-full">
        
        {/* Header Section - Iski height fixed rahegi */}
        <div className="text-center mb-6 shrink-0">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600 mb-2">
            Video Hub
          </h1>
          <button
            onClick={showFavorites ? () => setShowFavorites(false) : fetchFavorites}
            className={`mt-2 px-6 py-2 rounded-full font-bold transition shadow-md ${
              showFavorites ? "bg-gray-800 text-white" : "bg-yellow-500 text-black hover:bg-yellow-600"
            }`}
          >
            {showFavorites ? "⬅ Back to Search" : "⭐ My Favorites"}
          </button>
        </div>

        {!showFavorites ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Platform & Filters - Yeh bhi fixed rahen ge */}
            <div className="shrink-0">
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setType("youtube")}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    type === "youtube" ? "bg-red-600 text-white scale-105" : "bg-white text-gray-700"
                  }`}
                >
                  📺 YouTube
                </button>
                <button
                  onClick={() => setType("dailymotion")}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    type === "dailymotion" ? "bg-blue-600 text-white scale-105" : "bg-white text-gray-700"
                  }`}
                >
                  🎬 Dailymotion
                </button>
              </div>

              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm">
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="w-full max-w-lg px-6 py-3 border-2 border-gray-100 rounded-xl outline-none focus:border-red-500"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
                <select
                  className="w-full md:w-48 px-4 py-3 border-2 border-gray-100 rounded-xl outline-none"
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
            </div>

            {/* Video Grid Area - Yeh area scroll karega */}
            <div className="flex-grow overflow-hidden bg-white rounded-3xl p-4 shadow-sm">
              <VideoGrid key={`${type}-${lang}-${query}`} type={type} query={query} lang={lang} />
            </div>
          </div>
        ) : (
          /* Favorites Area */
          <div className="flex-grow overflow-hidden bg-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Saved Videos ❤️</h2>
            <div className="h-full overflow-y-auto custom-scrollbar">
              {favorites.length === 0 ? (
                <p className="text-gray-400 text-center py-20">No Video Saved</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
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
          </div>
        )}
      </div>
    </div>
  );
}