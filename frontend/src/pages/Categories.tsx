import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/base_url";
interface Category {
  id: number;
  name: string;
  description: string;
}
const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

// Search & Pagination State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  if (!authContext) {
    return <p>Auth context not available</p>;
  }

  const { user } = authContext;

  useEffect(() => {
    fetchCategories();
  }, [user?.token, page]);

   const fetchCategories = async (searchQuery ="") => {
      if (!user?.token) {
        setError("Unauthorized. Please log in.");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/categories?search=${searchQuery}&page=${page}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // setCategories(response.data);
        setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
        setTotalPages(response.data.totalPages || 1);
        console.log(response.data)
      
      } catch (error: any) {
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };
  const handleDelete = async (id: number) => {
    if (!user?.token) {
      setError("Unauthorized. Please log in.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setCategories(categories.filter((category) => category.id !== id));
    } catch (error: any) {
      setError("Failed to delete category.");
    }
  };

 //  Handle Search
  const handleSearch = () => {
    setPage(1); // reset to first page
    fetchCategories(search);
  };
   // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
 const handlePrev = () =>{
  if (page > 1) setPage((prev) => prev -1);
 };
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Categories</h2>

      {error && <p className="bg-red-100 text-red-600 px-4 py-2 rounded">{error}</p>}
      {loading ? <p>Loading categories...</p> : null}
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
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border">
              <td className="border p-2">{category.name}</td>
              <td className="border p-2">{category.description}</td>
              <td className="border p-2 space-x-2 flex flex-row">
                <button
                  onClick={() => navigate(`/category/${category.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>
                {user?.role === "ADMIN" && (
                  <>
                    <button
                      onClick={() => navigate(`/categories/update/${category.id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default Categories;
