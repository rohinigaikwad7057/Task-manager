import React, { useState } from "react";
// import Navbar from "./Component/navbar";
// import Dashboard from "./components/dashboard";
// import useTasks from "./hooks/useTasks";
import Navbar from "./Component/navbar";
import Dashboard from "./Pages/dashboard";
import useTasks from "./Fetures/Hooks/useTasks";
import Sidebar from "./Component/sidebar";


const App = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const {
    task,
    input,
    setInput,
    priority,
    setPriority,
    addTask,
    deleteTask,
    editTask,
    editTitle,
    setEditTitle,
    editPriority,
    setEditPriority,
    handleEditClick,
    saveEditTask,
    setEditTask,
    moveTask,
    search,
    filterPriority,
    setSearchParams
  } = useTasks();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fb]">

      {/* Sidebar */}
      <Sidebar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar
          input={input}
          setInput={setInput}
          addTask={addTask}
          priority={priority}
          setPriority={setPriority}
          setOpenSidebar={setOpenSidebar}
        />

        {/* Dashboard */}
        <div className="flex-1 overflow-auto">
          <Dashboard
            task={task}
            deleteTask={deleteTask}
            onEdit={handleEditClick}
            moveTask={moveTask}
            search={search}
            filterPriority={filterPriority}
            setSearchParams={setSearchParams}
          />
        </div>

      </div>

      {/* Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-80 space-y-4">

            <h2 className="text-lg font-semibold">Edit Task</h2>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditTask(null)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEditTask}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default App;