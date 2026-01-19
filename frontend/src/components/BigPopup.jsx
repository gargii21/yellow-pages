// BigPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { getTasksByDate, updateTask, createTask } from "../api/tasks.js";
import EditTaskButton from "./editTaskButton.jsx";
import DeleteTaskButton from "./DelButton.jsx";
import Calendar from "./calender.jsx"; 

const BigPopup = ({ onMinimize, onTaskSelect }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = async () => {
    const data = await getTasksByDate(selectedDate.format("YYYY-MM-DD"));
    // Sort tasks by priority if they have priority field
    const sortedTasks = [...data].sort((a, b) => {
      if (a.priority !== undefined && b.priority !== undefined) {
        return a.priority - b.priority;
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
    setTasks(sortedTasks);
    const active = sortedTasks.find((t) => !t.completed);
    onTaskSelect(active);
  };

  const handleTaskToggle = async (task) => {
    if (task.completed) {
      await updateTask(task._id, { 
        completed: false, 
        completedAt: null 
      });
    } else {
      await updateTask(task._id, { 
        completed: true, 
        completedAt: new Date() 
      });
    }
    fetchTasks();
  };

  const handleAddTask = async () => {
    if (!newTaskTitle) return;
    await createTask({
      title: newTaskTitle,
      notes: "",
      date: selectedDate.toDate(),
      priority: tasks.length
    });
    setNewTaskTitle("");
    fetchTasks();
  };

  const handleTaskReorder = async (draggedId, targetId) => {
    const updatedTasks = [...tasks];
    const draggedIndex = updatedTasks.findIndex(t => t._id === draggedId);
    const targetIndex = updatedTasks.findIndex(t => t._id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const [draggedTask] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(targetIndex, 0, draggedTask);
    
    const updatePromises = updatedTasks.map((task, idx) => {
      return updateTask(task._id, { priority: idx });
    });
    
    await Promise.all(updatePromises);
    setTasks(updatedTasks);
  };

  const prevDate = () => setSelectedDate(selectedDate.subtract(1, "day"));
  const nextDate = () => setSelectedDate(selectedDate.add(1, "day"));

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const hasIncompleteTask = tasks.some(task => !task.completed);

  return (
    <>
      {/* Main popup */}
      <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-[#fadf44] rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={prevDate}
                className="text-3xl font-handwritten text-black hover:opacity-70 transition-opacity"
              >
                ←
              </button>
              
              {/* Clickable Date Button - REPLACE THE h2 WITH THIS */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCalendar(true);
                }}
                className="text-4xl font-handwritten text-black hover:opacity-70 transition-opacity"
              >
                {selectedDate.format("MMMM D, YYYY")}
              </button>
              
              <button
                onClick={nextDate}
                className="text-3xl font-handwritten text-black hover:opacity-70 transition-opacity"
              >
                →
              </button>
            </div>

            {/* Add Task */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                className="flex-1 px-4 py-3 text-lg font-handwritten text-black bg-transparent border-b-2 border-black/30 focus:border-black outline-none placeholder-black/50"
              />
              <button
                onClick={handleAddTask}
                className="px-6 py-3 text-lg font-handwritten text-black bg-white/30 hover:bg-white/40 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="px-8 max-h-[60vh] overflow-y-auto pb-4">
            {tasks.length === 0 ? (
              <p className="text-center text-xl font-handwritten text-black/60 py-12">
                No tasks for {selectedDate.format("MMMM D")}. Add one above!
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <DraggableTaskItem
                    key={task._id}
                    task={task}
                    onTaskToggle={() => handleTaskToggle(task)}
                    fetchTasks={fetchTasks}
                    draggingTaskId={draggingTaskId}
                    setDraggingTaskId={setDraggingTaskId}
                    dragOverTaskId={dragOverTaskId}
                    setDragOverTaskId={setDragOverTaskId}
                    onTaskReorder={handleTaskReorder}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-black/10">
            <button
              onClick={onMinimize}
              disabled={!hasIncompleteTask}
              className={`w-full py-3 text-lg font-handwritten rounded-lg transition-colors ${
                !hasIncompleteTask 
                  ? 'text-black/30 bg-white/10 cursor-not-allowed' 
                  : 'text-black bg-white/30 hover:bg-white/40'
              }`}
            >
              {!hasIncompleteTask ? 'Add at least one task to minimize' : 'Minimize'}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Popup - RENDERED SEPARATELY */}
      {showCalendar && (
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </>
  );
};

// Draggable Task Item Component (keep this exactly as it was)
const DraggableTaskItem = ({ 
  task, 
  onTaskToggle, 
  fetchTasks, 
  draggingTaskId,
  setDraggingTaskId,
  dragOverTaskId,
  setDragOverTaskId,
  onTaskReorder
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes || "");
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef(null);

  // Update notes when task prop changes
  useEffect(() => {
    setNotes(task.notes || "");
  }, [task.notes]);

  const handleSaveNotes = async () => {
    await updateTask(task._id, { notes });
    setIsEditingNotes(false);
  };

  const handleStartEditingNotes = () => {
    setIsEditingNotes(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 10);
  };

  // Drag handlers
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task._id);
    setDraggingTaskId(task._id);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggingTaskId !== task._id) {
      setDragOverTaskId(task._id);
    }
  };

  const handleDragLeave = () => {
    if (dragOverTaskId === task._id) {
      setDragOverTaskId(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("text/plain");
    if (draggedTaskId && draggedTaskId !== task._id) {
      onTaskReorder(draggedTaskId, task._id);
    }
    setDragOverTaskId(null);
    setDraggingTaskId(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverTaskId(null);
    setIsDragging(false);
  };

  // Split notes into lines for display
  const getLinesFromNotes = (text) => {
    if (!text) return ["", "", ""];
    
    const lines = [];
    const maxCharsPerLine = 120;
    
    const paragraphs = text.split('\n');
    
    for (const paragraph of paragraphs) {
      if (lines.length >= 3) break;
      
      let currentLine = "";
      
      for (let i = 0; i < paragraph.length; i++) {
        if (lines.length >= 3) break;
        
        const char = paragraph[i];
        currentLine += char;
        
        if (currentLine.length >= maxCharsPerLine || 
            (char === ' ' && currentLine.length >= maxCharsPerLine - 10)) {
          lines.push(currentLine.trim());
          currentLine = "";
        }
      }
      
      if (currentLine.trim() && lines.length < 3) {
        lines.push(currentLine.trim());
      }
    }
    
    while (lines.length < 3) {
      lines.push("");
    }
    
    return lines.slice(0, 3);
  };

  const lines = getLinesFromNotes(notes);

  return (
    <>
      {/* Drop indicator */}
      {dragOverTaskId === task._id && draggingTaskId !== task._id && (
        <div className="h-1 border-t-2 border-black border-dashed my-1"></div>
      )}
      
      <div
        draggable="true"
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        className={`relative transition-all duration-200 ${
          isDragging ? "opacity-50" : ""
        } ${draggingTaskId === task._id ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* Task Title with Actions - All in one row */}
        <div className="flex items-center gap-2 bg-white/20 p-3 rounded-lg">
          {/* Drag Handle */}
          <div className="cursor-move text-black/50 hover:text-black">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 8h16M4 16h16" 
              />
            </svg>
          </div>
          
          <button
            onClick={onTaskToggle}
            className={`w-6 h-6 flex items-center justify-center text-xl font-handwritten ${
              task.completed ? 'text-black/40 hover:text-black' : 'text-black hover:text-black/70'
            }`}
            title={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? '✓' : '○'}
          </button>
          
          {/* Task Title */}
          <div className="flex-1">
            <EditTaskButton 
              task={task} 
              onUpdate={fetchTasks} 
              isDoubleClick={true}
            >
              <span 
                className={`text-xl font-handwritten ${
                  task.completed ? 'text-black/40 line-through' : 'text-black'
                }`}
              >
                {task.title}
              </span>
            </EditTaskButton>
          </div>
          
          {/* Notes Arrow */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-black/50 hover:text-black transition-colors p-1"
            title={isExpanded ? "Hide notes" : "Show notes"}
          >
            <div className="text-lg font-handwritten">
              {isExpanded ? '▼' : '►'}
            </div>
          </button>
          
          {/* Delete Button */}
          <DeleteTaskButton taskId={task._id} onDelete={fetchTasks} />
        </div>

        {/* Notebook-style Notes Section */}
        {isExpanded && (
          <div className="ml-12 mt-4">
            {isEditingNotes ? (
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={notes}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setNotes(e.target.value);
                    }
                  }}
                  className="w-full h-[72px] opacity-100 cursor-text resize-none font-handwritten text-black bg-transparent border-0 outline-none z-10"
                  rows={3}
                  placeholder="Start typing your notes here..."
                  style={{ 
                    caretColor: 'black',
                    lineHeight: '24px',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word'
                  }}
                  wrap="soft"
                />
                
                {/* Black lines behind the textarea */}
                <div className="absolute top-0 left-0 right-0 h-[72px] pointer-events-none">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="relative h-[24px]">
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-black"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {lines.map((line, index) => (
                  <div key={index} className="relative min-h-[24px]">
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-black"></div>
                    <div 
                      className={`font-handwritten px-2 pb-1 cursor-text ${line ? 'text-black' : 'text-black/30'}`}
                      onClick={handleStartEditingNotes}
                    >
                      {line || (index === 0 ? "Click to add notes..." : "")}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Save button with character count */}
            {isEditingNotes && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs font-handwritten text-black/50">
                  {notes.length}/1000 characters
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 text-sm font-handwritten text-black bg-white/30 hover:bg-white/40 rounded transition-colors"
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BigPopup;