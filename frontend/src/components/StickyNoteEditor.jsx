import React, { useState, useRef, useEffect } from "react";

const colorOptions = [
  { name: "Yellow", value: "#FEF3A8" },
  { name: "Blue", value: "#A8D8FE" },
  { name: "Green", value: "#A8FECB" },
  { name: "Pink", value: "#FEA8F1" },
  { name: "Orange", value: "#FED8A8" },
  { name: "Purple", value: "#D8A8FE" },
];

const StickyNoteEditor = ({ initialNote = null, onSave, onClose }) => {
  //const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [color, setColor] = useState(initialNote?.color || "#FEF3A8");
  const [width, setWidth] = useState(initialNote?.width || 250);
  const [height, setHeight] = useState(initialNote?.height || 200);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSave = () => {
    if (!content.trim()) return;
    
    const noteData = {
      id: initialNote?.id || Date.now().toString(),
      //title: title.trim() || "Untitled",
      content: content.trim(),
      color,
      width :300,
      height: 40,
      position: initialNote?.position || { 
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 100)
      },
      createdAt: initialNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave(noteData);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="rounded-xl shadow-2xl p-6 flex flex-col"
        style={{ 
          backgroundColor: color,
          width: '400px',
          minHeight: '300px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color Picker */}
        <div className="flex flex-wrap gap-2 mb-4">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption.value}
              onClick={() => setColor(colorOption.value)}
              className={`w-8 h-8 rounded-full border-2 ${
                color === colorOption.value ? 'border-black' : 'border-transparent'
              }`}
              style={{ backgroundColor: colorOption.value }}
              title={colorOption.name}
            />
          ))}
        </div>

        {/* Content Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your note here..."
          className="flex-1 bg-transparent border-none outline-none resize-none font-handwritten text-black text-lg"
          rows={8}
          onKeyDown={handleKeyDown}
          style={{ minHeight: '200px' }}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/20">
          <div className="text-sm font-handwritten text-black/70">
            Press Ctrl+Enter to save
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/30 text-black font-handwritten rounded-lg hover:bg-white/40"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-black text-white font-handwritten rounded-lg hover:bg-black/80"
              disabled={!content.trim()}
            >
              {initialNote ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyNoteEditor;