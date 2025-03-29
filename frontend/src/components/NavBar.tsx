import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface NavbarProps {
  user: {
    name: string;
    role: "ADMIN" | "ORGANIZATION" | "CAR_OWNER"; 
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const getDashboardTitle = () => {
    switch (user.role) {
      case "ADMIN":
        return "ADMIN DASHBOARD";
      case "ORGANIZATION":
        return "ORGANIZATION DASHBOARD";
      case "CAR_OWNER":
        return "CAR OWNERS DASHBOARD";
      default:
        return "DASHBOARD"; 
    }
  };

  return (
    <nav className="bg-none text-blue-900 flex justify-between m-2 border-3 border-blue-600 rounded-sm items-center p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-15 w-15" />
        <h1 className="text-xl font-bold">{getDashboardTitle()}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold">{user.name}</span>
        <FaUserCircle size={24} />
        <h1 className="text-xl font-bold">{user.role.toUpperCase()}</h1>
      </div>
    </nav>
  );
};

export default Navbar;
