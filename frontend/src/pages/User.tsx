import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/base_url";
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
// Search & Pagination State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);
  const fetchUsers = async (searchQuery ="") => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users?search=${searchQuery}&page=${page}`);
        setUsers(response.data);
        setTotalPages(response.data.totalPages || 1);
      console.log(response.data)
      } catch (err: any) {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

  const handleSearch = () => {
    setPage(1); 
    fetchUsers(search);
  };
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
  const handlePrev = () =>{
    if(page > 1) setPage((prev)=> prev- 1);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Users</h2>

      {loading && <p className="text-center text-gray-600">Loading users...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by brand, model..."
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
