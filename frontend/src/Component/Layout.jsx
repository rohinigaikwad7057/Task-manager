import Sidebar from "../Component/sidebar";
import Navbar from "../Component/navbar";

const Layout = ({ children, ...props }) => {
  return (
    <div className="flex h-screen bg-[#f6f8fb]">

      <Sidebar {...props} />

      <div className="flex-1 flex flex-col">

        <Navbar {...props} />

        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;