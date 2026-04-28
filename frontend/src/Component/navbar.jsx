import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ input, setInput, priority, setPriority, addTask, ...props }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const isTaskPage = location.pathname === "/tasks";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="bg-white px-4 md:px-6 py-3 flex justify-between items-center border-b">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => props.setOpenSidebar(true)}
          className="md:hidden text-xl"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold text-gray-700">
          {isTaskPage ? "Tasks" : "Dashboard"}
        </h1>
      </div>

      {/* RIGHT */}
      {isTaskPage ? (
        // TASK PAGE UI
        <div className="flex flex-1 justify-end gap-2 md:gap-3 w-full md:w-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search..."
            className="border rounded-lg px-3 py-1.5 w-full md:w-64 text-sm"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm"
          >
            Add
          </button>
        </div>
      ) : (
        // DASHBOARD UI
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/tasks")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
          >
            + Add Task
          </button>


          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
};

export default Navbar;