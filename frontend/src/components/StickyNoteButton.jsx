import React from "react";

const StickyNoteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-black text-[#fadf44] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[1000]"
      title="Add sticky note"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-7 w-7" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
          clipRule="evenodd" 
        />
      </svg>
    </button>
  );
};

export default StickyNoteButton;