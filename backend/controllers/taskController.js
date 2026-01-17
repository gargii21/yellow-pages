import Task from "../models/task.js";

/* ---------- Get tasks by date ---------- */
export const getTasksByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: "Date is required" });

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const tasks = await Task.find({ date: { $gte: start, $lte: end } }).sort({ createdAt: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- Create a new task ---------- */
export const createTask = async (req, res) => {
  try {
    const { title, notes, date } = req.body;

    if (!title || !date) return res.status(400).json({ message: "Title and date are required" });

    const task = await Task.create({ title, notes, date });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- Update a task ---------- */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- Delete a task ---------- */
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
