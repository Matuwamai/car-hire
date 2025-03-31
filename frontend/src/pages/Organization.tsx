import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext"; 

const Organizations = () => {
    const { user } = useContext(AuthContext);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) {
      fetchOrganizations();
    } else {
      setError("User not authenticated. Please log in.");
      setLoading(false);
    }
  }, [user?.token]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/organizations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, 
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch organizations");
  
      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/organizations/verify/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to verify organization");

      fetchOrganizations(); 
    } catch (err) {
      alert(err.message);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this organization?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/organizations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete organization");

      setOrganizations((prev) => prev.filter((org) => org.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Organizations</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Profile</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">License</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{org.id}</td>
                <td className="border p-2">
                  <img
                    src={org.user?.profileImage || "/default-avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                </td>
                <td className="border p-2">{org.user?.name}</td>
                <td className="border p-2">{org.user?.email}</td>
                <td className="border p-2">{org.license || "N/A"}</td>
                <td className="border p-2 font-bold">
                  {org.isVerified ? <span className="text-green-600">✔ Verified</span> : <span className="text-red-500">Not Verified</span>}
                </td>
                <td className="border p-2 space-x-2">
                  {!org.isVerified && (
                    <button
                      onClick={() => handleVerify(org.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Verify
                    </button>
                  )}
                  <Link
                    to={`/organizations/${org.id}`}
                    className="bg-gray-600 hover:bg-gray-800 text-white py-1 px-3 rounded text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Organizations;
