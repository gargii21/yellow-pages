// BigPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { getTasksByDate, updateTask, createTask } from "../api/tasks.js";
// BigPopup.jsx (updated TaskItem component)
import EditTaskButton from "./editTaskButton.jsx";
import DeleteTaskButton from "./DelButton.jsx";


const BigPopup = ({ onMinimize, onTaskSelect }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const fetchTasks = async () => {
    const data = await getTasksByDate(selectedDate.format("YYYY-MM-DD"));
    setTasks(data);
    // Find the first incomplete task
    const active = data.find((t) => !t.completed);
    onTaskSelect(active);
  };

  const handleTaskComplete = async (task) => {
    await updateTask(task._id, { completed: true, completedAt: new Date() });
    fetchTasks();
  };

  const handleAddTask = async () => {
    if (!newTaskTitle) return;
    await createTask({
      title: newTaskTitle,
      notes: "",
      date: selectedDate.toDate(),
    });
    setNewTaskTitle("");
    fetchTasks();
  };

  const prevDate = () => setSelectedDate(selectedDate.subtract(1, "day"));
  const nextDate = () => setSelectedDate(selectedDate.add(1, "day"));

  // Check if there's any incomplete task
  const hasIncompleteTask = tasks.some(task => !task.completed);

  return (
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
            <h2 className="text-4xl font-handwritten text-black">
              {selectedDate.format("MMMM D, YYYY")}
            </h2>
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
        <div className="px-8  max-h-[60vh] overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-center text-xl font-handwritten text-black/60 py-12">
              No tasks for today. Add one above!
            </p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onComplete={() => handleTaskComplete(task)}
                  fetchTasks={fetchTasks}
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
  );
};


// In BigPopup.jsx - Update the TaskItem component:

const TaskItem = ({ task, onComplete, fetchTasks }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(task.notes || "");
  const textareaRef = useRef(null);

  // Update notes when task prop changes
  useEffect(() => {
    setNotes(task.notes || "");
  }, [task.notes]);

  const handleTaskToggle = async () => {
    if (task.completed) {
      // Uncheck the task
      await updateTask(task._id, { 
        completed: false, 
        completedAt: null 
      });
    } else {
      // Complete the task
      await updateTask(task._id, { 
        completed: true, 
        completedAt: new Date() 
      });
    }
    fetchTasks();
  };

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

  // Split notes into lines for display - FIXED VERSION
  const getLinesFromNotes = (text) => {
    if (!text) return ["", "", ""];
    
    const lines = [];
    const maxCharsPerLine = 120;
    
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

  const lines = getLinesFromNotes(notes);

  return (
    <div className="relative">
      {/* Task Title with Actions - All in one row */}
      <div className="flex items-center gap-3 bg-white/20 p-3 rounded-lg">
        <button
          onClick={handleTaskToggle}
          className={`w-6 h-6 flex items-center justify-center text-xl font-handwritten ${
            task.completed ? 'text-black/40 hover:text-black' : 'text-black hover:text-black/70'
          }`}
          title={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? '✓' : '○'}
        </button>
        
        {/* Double-click editable task title */}
        <EditTaskButton 
          task={task} 
          onUpdate={fetchTasks} 
          isDoubleClick={true}
        >
          <span 
            className={`text-2xl font-handwritten ${task.completed ? 'text-black/40 line-through' : 'text-black'}`}
          >
            {task.title}
          </span>
        </EditTaskButton>
        
        {/* Notes Arrow - AT THE END */}
        <div 
          className="ml-auto cursor-pointer text-black/50 hover:text-black mr-2"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Hide notes" : "Show notes"}
        >
          <div className="text-lg font-handwritten">
            {isExpanded ? '▼' : '►'}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <DeleteTaskButton taskId={task._id} onDelete={fetchTasks} />
        </div>
      </div>

      {/* Notebook-style Notes Section */}
      {isExpanded && (
        <div className="ml-9 mt-4">
          {isEditingNotes ? (
            <div className="relative">
              {/* Visible textarea for typing with cursor - covers all 3 lines */}
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
            // When NOT editing - show the actual text split into 3 lines
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
  );
};
export default BigPopup;