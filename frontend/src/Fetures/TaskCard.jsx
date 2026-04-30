import { Pencil, Trash2, Play, Check, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskCard = ({
  task,
  onStart,
  onComplete,
  onDelete,
  onEdit,
  onDateChange
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close on outside click (desktop only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Priority style
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-600";
      case "high":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  // Status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "todo":
        return "border-l-4 border-blue-500 bg-white";
      case "progress":
        return "border-l-4 border-yellow-500 bg-white";
      case "completed":
        return "border-l-4 border-green-500 bg-white";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div
      className={`rounded-lg p-4 border shadow-sm hover:shadow-md transition ${getStatusStyle(
        task.status
      )}`}
    >
      {/* Title */}
      <h3 className="text-gray-800 font-medium mb-2">
        {task.title}
      </h3>

      {/* Date + Priority */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">

        {/* Date Picker */}
        <div className="flex items-center gap-2 relative" ref={ref}>
          
          <Calendar
            size={16}
            onClick={() => setOpen(true)}
            className="cursor-pointer text-gray-500 hover:text-blue-500"
          />

          <span className="text-xs">
            {task.createdAt
              ? new Date(task.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              : "No date"}
          </span>

          {open && (
            <>
              {/* MOBILE MODAL */}
              <div
                className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 sm:hidden"
                onClick={() => setOpen(false)}
              >
                <div
                  className="bg-white rounded-lg p-3 shadow-xl w-[90%] max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DatePicker
                    selected={task.createdAt ? new Date(task.createdAt) : null}
                    onChange={(date) => {
                      if (typeof onDateChange === "function") {
                        onDateChange(task._id, date);
                      }
                      setOpen(false);
                    }}
                    inline
                  />
                </div>
              </div>

              {/* DESKTOP DROPDOWN */}
              <div className="hidden sm:block absolute top-7 left-0 z-50 bg-white shadow-xl rounded-lg p-2">
                <DatePicker
                  selected={task.createdAt ? new Date(task.createdAt) : null}
                  onChange={(date) => {
                    if (typeof onDateChange === "function") {
                      onDateChange(task._id, date);
                    }
                    setOpen(false);
                  }}
                  inline
                />
              </div>
            </>
          )}
        </div>

        {/* Priority */}
        <span
          className={`px-2 py-1 rounded-full text-xs ${getPriorityStyle(
            task.priority
          )}`}
        >
          {task.priority}
        </span>

      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 text-sm">

        {onStart && (
          <button className="text-gray-500 hover:text-gray-700" onClick={onStart}>
            <Play size={16} />
          </button>
        )}

        {onComplete && (
          <button className="text-blue-500 hover:text-blue-600" onClick={onComplete}>
            <Check size={16} />
          </button>
        )}

        {onEdit && (
          <button className="text-purple-500 hover:text-purple-600" onClick={onEdit}>
            <Pencil size={16} />
          </button>
        )}

        <button className="text-red-500 hover:text-red-600" onClick={onDelete}>
          <Trash2 size={16} />
        </button>

      </div>
    </div>
  );
};

export default TaskCard;