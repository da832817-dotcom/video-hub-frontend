const BASE_URL = "http://localhost:8001";

export const apiService = {
  // 1. YouTube Fetch
  async getYouTubeVideos(query = "", pageToken = "", lang = "en") {
    try {
      const url = `${BASE_URL}/youtube/search?q=${encodeURIComponent(query)}&pageToken=${pageToken}&lang=${lang}`;
      const res = await fetch(url);
      const data = await res.json();
      return {
        items: data.items || [],
        nextPageToken: data.nextPageToken || ""
      };
    } catch (err) {
      console.error("YouTube Fetch Error:", err);
      return { items: [], nextPageToken: "" };
    }
  },

  // 2. Dailymotion Fetch
  async getDailymotionVideos(page = 1, query = "", lang = "en") {
    try {
      const url = `${BASE_URL}/dailymotion/search?page=${page}&q=${encodeURIComponent(query)}&lang=${lang}`;
      const res = await fetch(url);
      const data = await res.json();
      return {
        list: data.list || [],
        has_more: data.has_more || false
      };
    } catch (err) {
      console.error("Dailymotion Fetch Error:", err);
      return { list: [], has_more: false };
    }
  },

  // 3. Database: Save Video
  async saveVideo(videoData) {
    try {
      const res = await fetch(`${BASE_URL}/save-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoData),
      });
      return res.ok;
    } catch (err) {
      console.error("Save Error:", err);
      return false;
    }
  },

  // 4. Database: Get All Favorites
  async getFavorites() {
    try {
      const res = await fetch(`${BASE_URL}/favorites`);
      return await res.json();
    } catch (err) {
      console.error("Fetch Favorites Error:", err);
      return [];
    }
  },

  // 5. Database: Delete Favorite
  async deleteFavorite(vId) {
    try {
      const res = await fetch(`${BASE_URL}/delete-favorite/${vId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch (err) {
      console.error("Delete Error:", err);
      return false;
    }
  }
};