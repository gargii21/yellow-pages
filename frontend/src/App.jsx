// App.jsx
import React, { useState, useEffect } from "react";
import BigPopup from "./components/BigPopup";
import MiniPopup from "./components/MiniPopup";
import { getTasksByDate } from "./api/tasks.js";

function App() {
  const [mini, setMini] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  // Refresh task data periodically
  useEffect(() => {
    if (mini && activeTask) {
      const interval = setInterval(async () => {
        const data = await getTasksByDate(new Date().toISOString().split('T')[0]);
        const updatedTask = data.find(t => t._id === activeTask._id);
        if (updatedTask) {
          setActiveTask(updatedTask);
        }
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [mini, activeTask]);

  const handleTaskUpdate = async () => {
    if (activeTask) {
      const data = await getTasksByDate(new Date().toISOString().split('T')[0]);
      const updatedTask = data.find(t => t._id === activeTask._id);
      if (updatedTask) {
        setActiveTask(updatedTask);
      }
    }
  };

  return (
    <>
      {!mini && (
        <BigPopup 
          onMinimize={() => setMini(true)} 
          onTaskSelect={setActiveTask}
        />
      )}
      {mini && activeTask && (
        <MiniPopup
          task={activeTask}
          onMaximize={() => setMini(false)}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
}

export default App;