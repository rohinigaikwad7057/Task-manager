import { Pencil, Trash2, Play, Check } from "lucide-react";

const TaskCard = ({ task, onStart, onComplete, onDelete, onEdit }) => {

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "low":
                return "bg-green-100 text-green-700";
            case "high":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">

            {/* Title */}
            <h3 className="text-gray-800 font-medium mb-2">
                {task.title}
            </h3>

            {/* Date + Badge */}
            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">

                {/* Date */}
                <span>
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}
                </span>

                {/* Priority */}
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                </span>

            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 text-sm">

                {/* Start */}
                {onStart && (
                    <button title="Start" onClick={onStart} className="text-gray-500 hover:text-gray-700">
                        <Play size={16} />
                    </button>
                )}

                {/* Complete */}
                {onComplete && (
                    <button title="Complete" onClick={onComplete} className="text-blue-500 hover:text-blue-600">
                        <Check size={16} />
                    </button>
                )}

                {/* Edit */}
                {onEdit && (
                    <button title="Edit" onClick={onEdit} className="text-purple-500 hover:text-purple-600">
                        <Pencil size={16} />
                    </button>
                )}

                {/* Delete */}
                <button title="Delete" onClick={onDelete} className="text-red-500 hover:text-red-600">
                    <Trash2 size={16} />
                </button>

            </div>
        </div>
    );
};

export default TaskCard;