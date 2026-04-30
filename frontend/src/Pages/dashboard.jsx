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
  setSearchParams,
  handleDateChange
}) => {

  const debouncedSearch = useDebounce(search, 400);

  const isDisabled = task.length === 0;

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

  const isFilteredEmpty = filteredTasks.length === 0;

  // EMPTY STATE (SaaS style)
  if (task.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div>

          {/* Illustration */}


          {/* Heading */}
          <h2 className="text-lg font-semibold text-gray-700">
            No tasks yet
          </h2>

          {/* Subtext */}
          <p className="text-sm text-gray-500 mt-1">
            You haven’t added any tasks. Start organizing your work 🚀
          </p>


        </div>
      </div>
    );
  }

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

    if (sourceCol === destCol) return;

    moveTask(draggedTask._id, destCol);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 flex-1">

      {/* FILTER BAR */}
      <div className="mb-4 flex flex-wrap items-center gap-3">

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) =>
            setSearchParams({
              search: e.target.value,
              priority: filterPriority,
            })
          }
          placeholder={isDisabled ? "No tasks to search" : "Search tasks..."}
          disabled={isDisabled}
          className={`px-3 py-1.5 border rounded-full text-sm w-44 
            ${isDisabled
              ? "bg-gray-100 cursor-not-allowed border-gray-200"
              : "border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400"
            }`}
        />

        {/* PRIORITY FILTER */}
        <div className="flex items-center gap-2">
          {["all", "low", "medium", "high"].map((p) => (
            <button
              key={p}
              disabled={isDisabled}
              onClick={() =>
                setSearchParams({
                  search,
                  priority: p,
                })
              }
              className={`px-3 py-1 rounded-full text-xs ${filterPriority === p
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* CLEAR */}
        {(search || filterPriority !== "all") && (
          <button
            disabled={isDisabled}
            onClick={() =>
              setSearchParams({
                search: "",
                priority: "all",
              })
            }
            className={`text-xs ${isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-red-500"
              }`}
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

                  <div className="px-4 py-3 border-b">

                    {/* Title */}
                    <div className="font-semibold text-gray-700 capitalize">
                      {key} ({tasks.length})
                    </div>

                    {/* Subtitle */}
                    <p className="text-xs text-gray-400 mt-1">
                      {key === "todo" && "You need to start"}
                      {key === "progress" && "You are currently working on"}
                      {key === "completed" && "Great job 🎉"}
                    </p>

                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">

                    {/* EMPTY COLUMN MESSAGE */}
                    {tasks.length === 0 && (
                      <p className="text-gray-400 text-sm">
                        {isFilteredEmpty
                          ? "No matching tasks"
                          : "No tasks"}
                      </p>
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
                              onDateChange={handleDateChange}
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