// PrioritySortIndicator.jsx
import React from "react";

const PrioritySortIndicator = () => {
  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-white/20 rounded-lg mb-2 mt-2">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4 text-black/60" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
      <span className="font-handwritten text-black/70 text-xs">
        Drag tasks to set priority (top = highest)
      </span>
    </div>
  );
};

export default PrioritySortIndicator;