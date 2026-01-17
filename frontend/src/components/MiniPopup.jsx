import React, { useState, useEffect } from "react";

const MiniPopup = ({ task, onMaximize }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Sync position if needed
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Split notes into lines for display (READ-ONLY)
  const getLinesFromNotes = (text) => {
    if (!text) return ["", "", ""];
    
    const lines = [];
    const maxCharsPerLine = 50; // Slightly shorter for mini popup
    
    // Split by actual newlines first
    const paragraphs = text.split('\n');
    
    for (const paragraph of paragraphs) {
      if (lines.length >= 3) break;
      
      // Process paragraph character by character for accurate wrapping
      let currentLine = "";
      
      for (let i = 0; i < paragraph.length; i++) {
        if (lines.length >= 3) break;
        
        const char = paragraph[i];
        currentLine += char;
        
        // If line reaches max length or we hit a space at near-max length
        if (currentLine.length >= maxCharsPerLine || 
            (char === ' ' && currentLine.length >= maxCharsPerLine - 10)) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
      }
      
      // Add remaining part of paragraph if any
      if (currentLine.trim() && lines.length < 3) {
        lines.push(currentLine.trim());
      }
    }
    
    // Fill remaining lines with empty strings
    while (lines.length < 3) {
      lines.push("");
    }
    
    return lines.slice(0, 3);
  };

  const lines = getLinesFromNotes(task.notes || "");

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={onMaximize}
      className="fixed cursor-grab active:cursor-grabbing z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="bg-[#FFDE21] rounded-xl shadow-2xl p-4 min-w-[250px] border border-black/20">
        {/* Task Title */}
        <div className="text-lg font-handwritten text-black mb-4">
          {task.title}
        </div>
        
        {/* READ-ONLY Notebook-style Notes */}
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div key={index} className="relative min-h-[18px]">
              {/* Black line under the text */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-black"></div>
              <div className={`font-handwritten px-1 pb-1 text-sm ${line ? 'text-black' : 'text-black/20'}`}>
                {line || (index === 0 ? "No notes yet" : "")}
              </div>
            </div>
          ))}
        </div>
        
        {/* Character count (read-only)
        {task.notes && (
          <div className="text-xs font-handwritten text-black/50 mt-3">
            {task.notes.length}/1000 characters
          </div>
        )} */}
        
        <div className="text-xs font-handwritten text-black/50 mt-3 pt-2 border-t border-black/10">
          <div>Double click to edit in full view</div>
        </div>
      </div>
    </div>
  );
};

export default MiniPopup;