import React from "react";

const TaskItem = ({ task, active, onComplete, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: "10px",
        marginBottom: "5px",
        borderRadius: "6px",
        background: active ? "#FFF59D" : "#FFFEC7",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
        {task.title}
      </span>
      {!task.completed && <button onClick={(e) => { e.stopPropagation(); onComplete(); }}>✓</button>}
    </div>
  );
};

export default TaskItem;
