import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react"; 
const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-4 text-red-500">
          <ShieldOff size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <Link
          to="/cars"
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
