const Navbar = ({ input, setInput, addTask, priority, setPriority, setOpenSidebar }) => {
  return (
   <div className="bg-white px-4 md:px-6 py-3 flex flex-wrap md:flex-nowrap items-center gap-3 border-b">

  {/* LEFT */}
  <div className="flex items-center gap-2">
    <button
      onClick={() => setOpenSidebar(true)}
      className="md:hidden text-xl"
    >
      ☰
    </button>
    <h1 className="text-lg md:text-xl font-semibold text-gray-700">
      Dashboard
    </h1>
  </div>

  {/* RIGHT */}
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
</div>
  );
};

export default Navbar;