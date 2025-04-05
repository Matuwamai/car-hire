import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
  createdAt: string;
  role: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/");
        setUsers(response.data);
      } catch (err: any) {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Users</h2>

      {loading && <p className="text-center text-gray-600">Loading users...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Profile</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">
                    <img
                      src={user.profileImage || "./public/default-avatar.png"}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 w-20 rounded-lg text-blue-600 text-sm font-semibold" 
                      style={{
                        backgroundColor:
                          user.role === "ADMIN"
                          ? "#FFFFFF"
                            : user.role === "CAR_OWNER"
                           ? "#FFFFFF"
                            : "#FFFFFF",
                      }}
                      >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link
                      to={`/users/${user.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
