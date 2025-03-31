import { Navigate, Outlet, redirect } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";

const Layout = () => {
  const authContext = useContext(AuthContext);


  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user } = authContext; // Get user data from AuthContext
  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex">
      <Sidebar user={user} /> {/* Pass user from context */}
      <div className="flex flex-col flex-1">
        <Navbar user={user} /> {/* Pass user from context */}
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
