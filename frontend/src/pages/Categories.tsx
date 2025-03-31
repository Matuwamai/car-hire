import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

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

  if (!authContext) {
    return <p>Auth context not available</p>;
  }

  const { user } = authContext;

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user?.token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setCategories(response.data);
      } catch (error: any) {
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user?.token]);

  // Delete Category (Only Admin)
  const handleDelete = async (id: number) => {
    if (!user?.token) {
      setError("Unauthorized. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setCategories(categories.filter((category) => category.id !== id));
    } catch (error: any) {
      setError("Failed to delete category.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Categories</h2>

      {error && <p className="bg-red-100 text-red-600 px-4 py-2 rounded">{error}</p>}
      {loading ? <p>Loading categories...</p> : null}

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
                {/* View Button (Visible to Everyone) */}
                <button
                  onClick={() => navigate(`/category/${category.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>

                {/* Update & Delete Only for Admin */}
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
    </div>
  );
};

export default Categories;
