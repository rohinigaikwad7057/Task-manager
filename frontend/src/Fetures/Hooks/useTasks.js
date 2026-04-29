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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const filterPriority = searchParams.get("priority") || "all";

  const token = localStorage.getItem("token");

  // ✅ API HANDLER (memoized)
  const apiCall = useCallback(
    async (url, options = {}) => {
      if (!token) return null;

      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          ...options,
        });

        if (res.status === 401) {
          localStorage.clear();
          navigate("/login");
          return null;
        }

        return await res.json();
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
        return null;
      }
    },
    [token, navigate]
  );

  // FETCH TASKS (fixed dependencies)
  const fetchTasks = useCallback(async () => {
    if (!token) return;

    setLoading(true);

    const data = await apiCall(API_URL);

    if (data) setTask(data);

    setLoading(false);
  }, [apiCall, token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ✅ ADD TASK
  const addTask = async () => {
    if (!input.trim()) return;

    const newTask = await apiCall(API_URL, {
      method: "POST",
      body: JSON.stringify({
        title: input,
        status: "todo",
        priority,
      }),
    });

    if (newTask) {
      setTask((prev) => [newTask, ...prev]);
      setInput("");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    await apiCall(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setTask((prev) => prev.filter((t) => t._id !== id));
  };

  // MOVE TASK
  const moveTask = async (id, status) => {
    await apiCall(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    setTask((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, status } : t
      )
    );
  };

  // EDIT TASK
  const handleEditClick = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  const saveEditTask = async () => {
    const updated = await apiCall(`${API_URL}/${editTask._id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: editTitle,
        priority: editPriority,
      }),
    });

    if (updated) {
      setTask((prev) =>
        prev.map((t) =>
          t._id === updated._id ? updated : t
        )
      );

      setEditTask(null);
    }
  };

  return {
    task,
    loading,
    error,
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