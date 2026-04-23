
import TaskCard from "./TaskCard";

const TaskColumn = ({
  title,
  tasks,
  actionType,
  onAction,
  deleteTask,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col min-h-300px md:h-[calc(100vh-120px)]">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold text-gray-700">
          {title} ({tasks.length})
        </h2>
        <span className="text-gray-400 cursor-pointer">⋯</span>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks</p>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onStart={actionType === "start" ? () => onAction(t.id) : null}
              onComplete={actionType === "complete" ? () => onAction(t.id) : null}
              onDelete={() => deleteTask(t.id)}
              onEdit={onEdit ? () => onEdit(t) : null}
            />
          ))
        )}
      </div>

      {/* Add Button */}
      <div className="p-4">
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-md">
          + Add task
        </button>
      </div>
    </div>
  );
};

export default TaskColumn;