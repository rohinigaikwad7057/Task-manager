const express = require("express");
const router = express.Router();
const Task = require("../models/taskModel");
const protect = require("../middleware/authMiddleware");

// GET TASKS
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD TASK
router.post("/", protect, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id,
    });

    const saved = await task.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TASK
router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ success: true });
});

// UPDATE TASK
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

module.exports = router;