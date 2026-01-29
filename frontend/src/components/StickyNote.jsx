import React, { useState, useRef, useEffect } from "react";

const StickyNote = ({ note, onUpdate, onDelete, onEdit }) => {
  const [position, setPosition] = useState(note.position || { x: 20, y: 20 });
  const [size, setSize] = useState({ width: note.width || 300, height: note.height || 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const noteRef = useRef(null);

  // Save position/size when changed
  useEffect(() => {
    if (onUpdate && (isDragging || isResizing)) {
      const saveUpdate = setTimeout(() => {
        onUpdate({
          ...note,
          position,
          width: size.width,
          height: size.height
        });
      }, 100);
      
      return () => clearTimeout(saveUpdate);
    }
  }, [position, size, isDragging, isResizing]);

  // Drag handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle') || e.target.closest('.action-button')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within screen bounds
      const boundedX = Math.max(10, Math.min(window.innerWidth - size.width - 10, newX));
      const boundedY = Math.max(10, Math.min(window.innerHeight - size.height - 10, newY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
    
    if (isResizing) {
      const newWidth = Math.max(200, Math.min(600, e.clientX - position.x));
      const newHeight = isExpanded ? Math.max(150, Math.min(400, e.clientY - position.y)) : 40;
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Resize handlers
  const handleResizeStart = (e) => {
    setIsResizing(true);
    setDragOffset({
      x: e.clientX - size.width,
      y: e.clientY - size.height,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  const handleResizeArrow = (direction) => {
    const step = 20;
    let newWidth = size.width;
    
    if (direction === 'left') newWidth = Math.max(200, size.width - step);
    if (direction === 'right') newWidth = Math.min(600, size.width + step);
    
    setSize({ ...size, width: newWidth });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this sticky note?')) {
      onDelete(note.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(note);
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // When expanding, set a default expanded size
      setSize({ ...size, height: 200 });
    } else {
      // When minimizing, set to small size
      setSize({ ...size, height: 40 });
    }
  };

  return (
    <div
  ref={noteRef}
  className={`fixed rounded-lg shadow-2xl z-[999] ${
    isDragging ? 'cursor-grabbing' : 'cursor-grab'
  } ${isResizing ? 'cursor-nwse-resize' : ''}`}
  style={{
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${isExpanded ? size.height : 40}px`,
    backgroundColor: note.color,
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
  }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Minimized View */}
      {!isExpanded ? (
        <div className="h-full flex items-center justify-between px-3">
          {/* Note content preview */}
          <div 
            className="flex-1 truncate font-handwritten text-black text-sm cursor-move"
            onMouseDown={handleMouseDown}
            title={note.content}
          >
            {note.content.length > 50 ? `${note.content.substring(0, 50)}...` : note.content}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Resize arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResizeArrow('left');
              }}
              className="action-button text-black/50 hover:text-black"
              title="Make narrower"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResizeArrow('right');
              }}
              className="action-button text-black/50 hover:text-black"
              title="Make wider"
            >
              →
            </button>
            
            {/* Expand button */}
            <button
              onClick={toggleExpand}
              className="action-button text-black/50 hover:text-black"
              title="Expand note"
            >
              ↑
            </button>
            
            {/* Edit button */}
            <button
              onClick={handleEdit}
              className="action-button text-black/50 hover:text-black"
              title="Edit"
            >
              ✎
            </button>
            
            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="action-button text-black/50 hover:text-black"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        /* Expanded View */
        <div className="h-full flex flex-col">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-3 border-b border-black/20 cursor-move"
            onMouseDown={handleMouseDown}
          >
            <div className="text-sm font-handwritten text-black/70">
              Sticky Note
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleExpand}
                className="action-button text-black/50 hover:text-black"
                title="Minimize"
              >
                ↓
              </button>
              <button
                onClick={handleEdit}
                className="action-button text-black/50 hover:text-black"
                title="Edit"
              >
                ✎
              </button>
              <button
                onClick={handleDelete}
                className="action-button text-black/50 hover:text-black"
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="font-handwritten text-black whitespace-pre-wrap">
              {note.content}
            </div>
          </div>
          
          {/* Footer with resize handle */}
          <div className="relative p-2 border-t border-black/10">
            <div className="flex justify-between items-center">
              <div className="text-xs font-handwritten text-black/50">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
              <div
                className="resize-handle w-4 h-4 cursor-nwse-resize"
                onMouseDown={handleResizeStart}
                title="Resize"
              >
                <div className="w-2 h-2 border-r-2 border-b-2 border-black/50"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickyNote;