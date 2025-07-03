import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { BASE_URL } from "@/base_url";

const CarOwners = () => {
  const { user } = useContext(AuthContext);
  const [carOwners, setCarOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

// Search & Pagination State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.token) {
      fetchCarOwners();
    } else {
      setError("User not authenticated. Please log in.");
      setLoading(false);
    }
  }, [user?.token, page]);

  const fetchCarOwners = async (searchQuery ="") => {
    try {
      const res = await fetch(`${BASE_URL}/api/carowners/?search=${searchQuery}&page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch car owners");

      const data = await res.json();
      setCarOwners(data);
      setTotalPages(data.totalPages || 1);
      console.log(data)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car owner?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/carowners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete car owner");

      setCarOwners((prev) => prev.filter((owner) => owner.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

 //  Handle Search
  const handleSearch = () => {
    setPage(1); // reset to first page
    fetchCarOwners(search);
  };
   // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
 const handlePrev =() =>{
  if (page > 1) setPage((prev) => prev-1);
 };
  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Car Owners</h2>
      {/* 🆕 Search Bar */}
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Profile</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">ID Number</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {carOwners.map((owner) => (
              <tr key={owner.id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{owner.id}</td>
                <td className="border p-2">
                  <img
                    src={owner.user?.profileImage || "/default-avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                </td>
                <td className="border p-2">{owner.user?.name}</td>
                <td className="border p-2">{owner.user?.email}</td>
                <td className="border p-2">{owner.phone}</td>
                <td className="border p-2">{owner.idNumber}</td>
                <td className="border p-2">{owner.address}</td>
                <td className="border p-2 space-x-2">
                  <Link
                    to={`/carowners/${owner.id}`}
                    className="bg-gray-600 hover:bg-gray-800 text-white py-1 px-3 rounded text-sm"
                  >
                    View
                  </Link>
                  {user?.role === "ADMIN" && (
                    <button
                      onClick={() => handleDelete(owner.id)}
                      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 🆕 Pagination Controls */}
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

export default CarOwners;
