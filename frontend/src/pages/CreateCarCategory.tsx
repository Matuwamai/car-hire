import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext"; 
interface CategoryFormData {
  name: string;
  description: string;
}
import { BASE_URL } from "@/base_url";
const CreateCategory = () => {
  const { register, handleSubmit, reset } = useForm<CategoryFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p>Auth context not available</p>;
  }

  const { user } = authContext;

  const onSubmit = async (data: CategoryFormData) => {
    if (!user?.token) {
      setError("Unauthorized. Please log in.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post(
        `${BASE_URL}/api/categories`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess("Category created successfully!");
      reset();
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to create category.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Create New Category</h2>

      {error && <p className="bg-red-100 text-red-600 px-4 py-2 rounded">{error}</p>}
      {success && <p className="bg-green-100 text-green-600 px-4 py-2 rounded">{success}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            placeholder="Enter category name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
            placeholder="Enter category description"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full transition-all duration-300"
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
