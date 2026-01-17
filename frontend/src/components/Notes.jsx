import React, { useState } from "react";
import { updateTask } from "../api/tasks.js";

const Notes = ({ task, onUpdate }) => {
  const [notes, setNotes] = useState(task.notes);

  const handleSave = async () => {
    await updateTask(task._id, { notes });
    onUpdate();
  };

  return (
    <div style={{ marginTop: "15px" }}>
      <textarea
        rows={4}
        style={{ width: "100%" }}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button onClick={handleSave} style={{ marginTop: "5px" }}>
        Save Notes
      </button>
    </div>
  );
};

export default Notes;
