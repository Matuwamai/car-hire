import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Layout = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = authContext; // Get user data from AuthContext
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (Fixed) */}
      <div className="w-64 bg-gray-800 text-white fixed h-full">
        <Sidebar user={user} />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Navbar (Fixed at the top) */}
        <div className="w-full bg-white shadow-md fixed top-0 left-64 right-0 z-10">
          <Navbar user={user} />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
