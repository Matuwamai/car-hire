import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { user } = authContext;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <nav className="bg-none text-blue-900 flex justify-between m-2 border-3 border-blue-600 rounded-sm items-center p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold">Guest</span>
          <FaUserCircle size={24} />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-none text-blue-900 flex justify-between m-2 border-3 border-blue-600 rounded-sm items-center p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
        {user?.role === "admin" && <h1 className="text-xl font-bold">ADMIN DASHBOARD</h1>}
        {user?.role === "organization" && <h1 className="text-xl font-bold">ORGANIZATION DASHBOARD</h1>}
        {user?.role === "carowner" && <h1 className="text-xl font-bold">CAR OWNERS DASHBOARD</h1>}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold">{user?.id || "Guest"}</span>
        <FaUserCircle size={24} />
      </div>
    </nav>
  );
};

export default Navbar;
