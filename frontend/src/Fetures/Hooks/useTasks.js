import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

//  ENV BASE URL
const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

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

  //API HANDLER
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
        toast.error("Server error");
        return null;
      }
    },
    [token, navigate]
  );

  // FETCH TASKS
  const fetchTasks = useCallback(async () => {
    setLoading(true);

    const data = await apiCall(API_URL);

    if (data) setTask(data);

    setLoading(false);
  }, [apiCall]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  //  ADD TASK
  const addTask = async () => {
    if (!input.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

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

      toast.success("Task added successfully 🎉");
    } else {
      toast.error("Failed to add task");
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    const res = await apiCall(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (res !== null) {
      setTask((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted successfully");
    }
  };

  // MOVE
  const moveTask = async (id, status) => {

    setTask((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, status } : t
      )
    );

    const res = await apiCall(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    if (!res) {
      setTask((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: t.status } : t
        )
      );
    }
  };

  // EDIT
  const handleEditClick = (task) => {
    setEditTask(task);
    setEditTitle(task.title);
    setEditPriority(task.priority);
  };

  // SAVE EDIT
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
      toast.success("Task updated successfully");
    }

  };

  const handleDateChange = async (id, date) => {
    // update in backend
    const updated = await apiCall(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        createdAt: date,
      }),
    });

    // update UI
    if (updated) {
      setTask((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, createdAt: date } : t
        )
      );

      toast.success("Date updated 📅");
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
    handleDateChange,
    saveEditTask,
    setEditTask,
    search,
    filterPriority,
    setSearchParams,
  };
};

export default useTasks;