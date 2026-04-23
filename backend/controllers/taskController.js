const Task = require("../models/taskModel");

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks };