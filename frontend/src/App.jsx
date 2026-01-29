// App.jsx
import React, { useState } from "react";
import BigPopup from "./components/BigPopup";
import MiniPopup from "./components/MiniPopup";
import StickyNotesContainer from "./components/StickyNotesContainer";

function App() {
  const [mini, setMini] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  return (
    <>
      {/* Sticky Notes (HIGHEST priority - always on top) */}
      <StickyNotesContainer />
      
      {/* Task Popups (BELOW sticky notes) */}
      {!mini && <BigPopup 
        onMinimize={() => setMini(true)} 
        onTaskSelect={setActiveTask}
      />}
      {mini && activeTask && (
        <MiniPopup
          task={activeTask}
          onMaximize={() => setMini(false)}
        />
      )}
    </>
  );
}

export default App;