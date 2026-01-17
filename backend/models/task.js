import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    notes: { type: String, default: "" },
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true } // automatically creates createdAt and updatedAt
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
