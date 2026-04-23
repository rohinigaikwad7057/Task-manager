import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/tasks";

const useTasks = () => {
  const [task, setTask] = useState([]); 

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");

  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const filterPriority = searchParams.get("priority") || "all";

  // FETCH TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTask(data);
    };

    fetchTasks();
  }, []);

  //  ADD TASK
  const addTask = async () => {
    if (!input.trim()) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: input,
        status: "todo",
        priority,
      }),
    });

    const newTask = await res.json();
    setTask((prev) => [...prev, newTask]);
    setInput(""); 
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setTask((prev) => prev.filter((t) => t._id !== id)); 
  };

  // MOVE TASK (drag)
const moveTask = async (id, status) => {
  const currentTask = task.find((t) => t._id === id);

  // ❌ Prevent duplicate update (VERY IMPORTANT)
  if (!currentTask || currentTask.status === status) return;

  // ✅ Optimistic UI update
  setTask((prev) =>
    prev.map((t) =>
      t._id === id ? { ...t, status } : t
    )
  );

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } catch (err) {
    console.error("Move failed", err);
  }
};

  // EDIT CLICK
  const handleEditClick = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  // SAVE EDIT 
  const saveEditTask = async () => {
    await fetch(`${API_URL}/${editTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        priority: editPriority,
      }),
    });

    setTask((prev) =>
      prev.map((t) =>
        t._id === editTask._id
          ? { ...t, title: editTitle, priority: editPriority }
          : t
      )
    );

    setEditTask(null);
  };

  return {
    task,
    input,
    setInput,
    priority,
    setPriority,
    addTask,
    deleteTask,
    moveTask,
    editTask,
    editTitle,
    setEditTitle,
    editPriority,
    setEditPriority,
    handleEditClick,
    saveEditTask,
    setEditTask,
    search,
    filterPriority,
    setSearchParams,
  };
};

export default useTasks;