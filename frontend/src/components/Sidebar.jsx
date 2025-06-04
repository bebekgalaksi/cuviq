import React from 'react';
import ChatbotIcon from '../assets/chatbot.png'; 
import CloseIcon from '../assets/sidebar.png';  

export default function Sidebar({ onClose }) {
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[#D9D9D9] shadow-lg z-40 p-4 flex flex-col justify-start rounded-r-lg">
      {/* Tombol Tutup Sidebar */}
      <div className="flex justify-end mb-4">
        <img
          src={CloseIcon}
          alt="Close Sidebar"
          onClick={onClose}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {/* Menu Chatbot Karir */}
      <div className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-300 rounded cursor-pointer border-b pb-3">
        <img src={ChatbotIcon} alt="Chatbot Icon" className="w-6 h-6" />
        <span className="text-sm font-semibold text-black">Chatbot Karir</span>
      </div>
    </div>
  );
}
