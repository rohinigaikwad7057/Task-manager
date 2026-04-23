const Sidebar = ({ openSidebar, setOpenSidebar }) => {
  return (
    
    <>
      {/* Overlay */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}

      {/* Sidebar */}
    <div
  className={`
    fixed md:static top-0 left-0 h-full z-50 w-45 md:w-45
    bg-linear-to-b from-[#1e293b] to-[#0f172a]
    text-white p-6 pt-16 md:pt-6
    overflow-y-auto
    transform transition-all duration-300 ease-in-out
    ${openSidebar ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>
        <h2 className="text-xl font-semibold mb-8">Task Manager</h2>

        <ul className="space-y-3">
          <li
  onClick={() => setOpenSidebar(false)}
  className="px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition"
>
  Dashboard
</li>
          <li
  onClick={() => setOpenSidebar(false)}
  className="px-3 py-2 rounded-lg cursor-pointer hover:bg-white/20 transition"
>
Task
</li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;