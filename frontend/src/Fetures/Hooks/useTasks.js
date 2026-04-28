import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/tasks";

const useTasks = () => {
  const [task, setTask] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");

  const [editTask, setEditTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const filterPriority = searchParams.get("priority") || "all";

  // AUTH HEADER
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // SINGLE SOURCE OF TRUTH
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setTask(data);
    } catch (err) {
      console.error(err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ADD TASK
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: input,
          status: "todo",
          priority,
        }),
      });

      const newTask = await res.json();

      setTask((prev) => [newTask, ...prev]);

      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    setTask((prev) => prev.filter((t) => t._id !== id));
  };

  // MOVE
  const moveTask = async (id, status) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      setTask((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT
  const handleEditClick = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const saveEditTask = async () => {
    const res = await fetch(`${API_URL}/${editTask._id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: editTitle,
        priority: editPriority,
      }),
    });

    const updated = await res.json();

    setTask((prev) =>
      prev.map((t) =>
        t._id === updated._id ? updated : t
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