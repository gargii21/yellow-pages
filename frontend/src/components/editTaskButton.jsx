// EditTaskButton.jsx
import React, { useState, useRef, useEffect } from "react";
import { updateTask } from "../api/tasks.js";

const EditTaskButton = ({ task, onUpdate, isDoubleClick = false, children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editedTitle.trim() === "") return;
    try {
      await updateTask(task._id, { title: editedTitle.trim() });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // If isDoubleClick is true, render the title as an editable element
  if (isDoubleClick) {
    return (
      <>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="flex-1 px-2 py-1 bg-white/50 border border-black/30 rounded font-handwritten text-2xl text-black outline-none"
          />
        ) : (
          <div 
            className="flex-1 cursor-text"
            onDoubleClick={() => setIsEditing(true)}
          >
            {children}
          </div>
        )}
      </>
    );
  }

  // Original icon-based editing
  return (
    <div className="relative">
      {/* Edit Icon */}
      <button
        onClick={() => setIsEditing(true)}
        className="text-black/50 hover:text-black transition-colors p-1"
        title="Edit task"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>

      {/* Edit Popup */}
      {isEditing && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-black/10 z-50 p-3">
          <p className="text-sm text-black mb-2 font-handwritten">
            Edit task title
          </p>
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-black/20 rounded mb-3 font-handwritten text-black outline-none focus:border-black"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-1 text-sm bg-[#FFDE21] text-black rounded hover:bg-[#FFD700] transition-colors font-handwritten"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
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

export default EditTaskButton;