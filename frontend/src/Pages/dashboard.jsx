import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../Fetures/TaskCard";
import useDebounce from "../Fetures/Hooks/useDebounce";

const Dashboard = ({
  task,
  deleteTask,
  onEdit,
  moveTask,
  search,
  filterPriority,
  setSearchParams
}) => {

  const debouncedSearch = useDebounce(search, 400);

  // FILTER LOGIC
  const filteredTasks = task.filter((t) => {
    const title = t?.title?.toLowerCase() || "";
    const searchText = debouncedSearch?.toLowerCase() || "";

    const matchesSearch = title.includes(searchText);

    const matchesPriority =
      filterPriority === "all"
        ? true
        : t.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  // CREATE COLUMNS
  const columns = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    progress: filteredTasks.filter((t) => t.status === "progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
  };

  // DRAG LOGIC
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

   const draggedTask = columns[sourceCol]?.[source.index];

if (!draggedTask) return;

    // prevent same column reorder
    if (sourceCol === destCol) return;

    // FIXED (_id)
    moveTask(draggedTask._id, destCol);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 flex-1">

      {/* FILTER BAR */}
      <div className="mb-4 flex flex-wrap items-center gap-3">

        <input
          value={search}
          onChange={(e) =>
            setSearchParams({
              search: e.target.value,
              priority: filterPriority,
            })
          }
          placeholder="Search tasks..."
          className="px-3 py-1.5 border border-gray-200 rounded-full text-sm w-44 
               focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        <div className="flex items-center gap-2">
          {["all", "low", "medium", "high"].map((p) => (
            <button
              key={p}
              onClick={() =>
                setSearchParams({
                  search,
                  priority: p,
                })
              }
              className={`px-3 py-1 rounded-full text-xs ${
                filterPriority === p
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {(search || filterPriority !== "all") && (
          <button
            onClick={() => setSearchParams({})}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            Clear ✕
          </button>
        )}

      </div>

      {/* DRAG & DROP */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {Object.entries(columns).map(([key, tasks]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white rounded-xl shadow-md flex flex-col min-h-300px md:h-[calc(100vh-120px)]"
                >

                  <div className="px-4 py-3 border-b font-semibold text-gray-700 capitalize">
                    {key} ({tasks.length})
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">

                    {tasks.length === 0 && (
                      <p className="text-gray-400 text-sm">No tasks</p>
                    )}

                    {tasks.map((t, index) => (
                      <Draggable
                        key={t._id} 
                        draggableId={t._id.toString()} 
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={t}
                              onDelete={() => deleteTask(t._id)} 
                              onEdit={() => onEdit(t)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>

                </div>
              )}
            </Droppable>
          ))}

        </div>
      </DragDropContext>

    </div>
  );
};

export default Dashboard;