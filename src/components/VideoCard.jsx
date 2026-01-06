import React, { useState } from "react";
import Modal from "react-modal";
import { apiService } from "../services/api"; 
import toast from "react-hot-toast"; 

Modal.setAppElement("#root");

export default function VideoCard({ type, video, isFavoriteView = false, refreshFavorites }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 1. DATA MAPPING
  const title = video?.title || video?.snippet?.title;
  const thumb = video?.thumbnail || 
    (type === "youtube" ? video?.snippet?.thumbnails?.high?.url : video?.thumbnail_480_url);
  const vId = video?.video_id || (
    type === "youtube" 
      ? (typeof video.id === "string" ? video.id : video.id.videoId) 
      : video.id
  );

  if (!vId) return null;

  // 2. SAVE LOGIC
  const handleSaveVideo = async (e) => {
    e.stopPropagation();
    try {
      const success = await apiService.saveVideo({ platform: type, video_id: vId, title, thumbnail: thumb });
      if (success) toast.success("Added to Favorites! ❤️");
      else toast.error("Failed to save video.");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // 3. DELETE LOGIC (Final Step)
  const confirmDelete = async () => {
    try {
      const success = await apiService.deleteFavorite(vId);
      if (success) {
        toast.success("Removed from favorites! 🗑️");
        if (refreshFavorites) refreshFavorites();
      }
      setIsDeleteModalOpen(false); 
    } catch (error) {
      toast.error("Delete Error!");
    }
  };

  return (
    <div className="group flex flex-col">
      {/* Thumbnail Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex-grow border border-gray-100"
      >
        <div className="relative overflow-hidden">
          <img src={thumb} alt={title} className="w-full h-48 object-cover group-hover:scale-110 transition duration-500" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300">
            <div className="bg-white/90 p-3 rounded-full text-red-600 shadow-lg scale-90 group-hover:scale-100 transition-transform">▶</div>
          </div>
        </div>
        <h3 className="p-3 text-sm font-semibold line-clamp-2 text-gray-800">{title}</h3>
      </div>

      {/* Action Buttons */}
      {!isFavoriteView ? (
        <button
          onClick={handleSaveVideo}
          className="bg-red-500 text-white py-2.5 px-4 rounded-xl mt-2 hover:bg-red-600 active:scale-95 transition-all font-bold text-xs uppercase shadow-sm"
        >
          Save Favorite ❤️
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Card click na trigger ho
            setIsDeleteModalOpen(true); // Confirmation modal khule
          }}
          className="bg-gray-100 text-gray-600 py-2.5 px-4 rounded-xl mt-2 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all font-bold text-xs uppercase border border-gray-200"
        >
          🗑️ Remove
        </button>
      )}

      {/* MODAL 1: Video Player */}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="relative bg-black w-[95%] max-w-5xl aspect-video rounded-2xl outline-none overflow-hidden shadow-2xl"
        overlayClassName="fixed inset-0 bg-black/90 flex justify-center items-center z-[100] backdrop-blur-sm"
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-10 bg-white/10 text-white p-2 rounded-full hover:bg-white/20">✕ Close</button>
        <iframe
          width="100%" height="100%"
          src={type === "youtube" ? `https://www.youtube.com/embed/${vId}?autoplay=1` : `https://www.dailymotion.com/embed/video/${vId}?autoplay=1`}
          title={title} allow="autoplay; fullscreen" allowFullScreen className="border-none"
        />
      </Modal>

      {/* MODAL 2: Delete Confirmation (Custom Popup) */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        className="bg-white p-8 rounded-3xl max-w-sm w-[90%] outline-none shadow-2xl"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[110]"
      >
        <div className="text-center">
          <div className="text-5xl mb-4 text-red-500">🗑️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
          <p className="text-gray-500 mb-6 text-sm">
            “Do you want to remove this video from your favorites?”
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}