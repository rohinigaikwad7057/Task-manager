const express = require("express");
const router = express.Router();
// const Task = require("../models/taskModules");
const Task = require("../models/taskModel")

// GET all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// ADD task
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  const saved = await task.save();
  res.json(saved);
});

// DELETE task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
 res.json({ success: true });
});

// UPDATE task
router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
res.json({ success: true });
});

module.exports = router;