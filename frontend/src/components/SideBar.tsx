import  { useState, useContext } from "react";
import {
  FaSignOutAlt, FaBars, FaTimes, FaUsers, FaCar, FaPlusCircle, FaHome, FaBook, FaUserCircle
} from "react-icons/fa";  
import { MdCategory } from "react-icons/md"; 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

interface SidebarProps {
  user: {
    role: "ADMIN" | "CAR_OWNER" | "ORGANIZATION";
  };
}
const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext); 

  const handleLogout = async () => {
    try {
      if (authContext?.logout) {
        await authContext.logout(); 
        navigate("/login");
      } else {
        alert("Logout function not found in context.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out.");
    }
  };

  const getMenuItems = () => {
    switch (user.role) {
      case "ADMIN":
        return [
          { path: "/users", label: "Users", icon: <FaUsers size={20} /> },
          { path: "/car-owners", label: "Car Owners", icon: <FaCar size={20} /> },
          { path: "/organizations", label: "Organizations", icon: <FaHome size={20} /> },
          { path: "/create-Category", label: "Create Category", icon: <FaPlusCircle size={20} /> },
          { path: "/categories", label: "Categories", icon: <MdCategory size={20} /> },
          { path: "/bookings", label: "Bookings", icon: <FaBook size={20} /> },
          { path: "/cars", label: "Cars", icon: <FaCar size={20} /> },
        ];
      case "CAR_OWNER":
        return [
          { path: "/create-car", label: "Create Car", icon: <FaPlusCircle size={20} /> },
          { path: "/my-cars?", label: "My Cars", icon: <FaCar size={20} /> },
          { path: "/categories", label: "Categories", icon: <MdCategory size={20} /> },
          { path: "/cars", label: "Cars", icon: <FaBook size={20} /> },
        ];
      case "ORGANIZATION":
        return [
          { path: "/cars", label: "Cars/Home", icon: <FaCar size={20} /> },
          { path: "/categories", label: "Categories", icon: <MdCategory size={20} /> },
          { path: "/myBookings", label: "my Bookings", icon: <FaBook size={20} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <button
        className="fixed top-4 left-5 z-50 text-white bg-blue-900 p-2 rounded-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
      </button>
      <div
        className={`h-screen w-64 bg-blue-600 text-white flex flex-col p-5 fixed top-0 left-0 transform transition-transform duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <h1 className="text-2xl font-bold text-start mb-5 ">Car Hire</h1>
        
        <nav className="flex flex-col gap-4">
          {getMenuItems().map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 p-2 hover:bg-blue-500 rounded-lg"
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 hover:bg-red-500 rounded-lg mt-auto"
          >
            <FaSignOutAlt size={20} /> Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
