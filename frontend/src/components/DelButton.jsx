// DeleteTaskButton.jsx
import React, { useState } from "react";
import { deleteTask } from "../api/tasks.js";

const DeleteTaskButton = ({ taskId, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTask(taskId);
      onDelete();
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="relative">
      {/* Trash Can Icon */}
      <button
        onClick={() => setShowConfirm(!showConfirm)}
        className="text-black/50 hover:text-black transition-colors p-1"
        title="Delete task"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>

      {/* Confirmation Popup */}
      {showConfirm && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-black/10 z-50 p-3">
          <p className="text-sm text-black mb-2 font-handwritten">
            Delete this task?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="flex-1 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-handwritten"
            >
              Delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-1 text-sm bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors font-handwritten"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteTaskButton;