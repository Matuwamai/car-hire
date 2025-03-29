import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";

// Example: Fetch the user role from localStorage, context, or API
const user = {
  role: "admin", // Change this dynamically based on actual user data
};

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex flex-col flex-1">
        <Navbar user={user} /> 
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
