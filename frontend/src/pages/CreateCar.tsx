import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context/authContext";

interface Category {
  id: string;
  name: string;
}

interface CarFormData {
  categoryId: string;
  registrationNo: string;
  brand: string;
  model: string;
  pricePerDay: number;
  mileage: number;
  color: string;
  description: string;
}

const CreateCar = () => {
  const { register, handleSubmit, reset } = useForm<CarFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p>Auth context not available</p>;
  }

  const { user } = authContext;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCategories(response.data);
      } catch (error) {
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, [user?.token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles(fileArray);

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    }
  };

  const onSubmit = async (data: CarFormData) => {
    if (!user) {
      setError("Unauthorized. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("ownerId", String(user.id));
      formData.append("ownerName", user.name);
      formData.append("categoryId", data.categoryId);
      formData.append("registrationNo", data.registrationNo);
      formData.append("brand", data.brand);
      formData.append("model", data.model);
      formData.append("pricePerDay", String(data.pricePerDay));
      formData.append("mileage", String(data.mileage));
      formData.append("color", data.color);
      formData.append("description", data.description);

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("http://localhost:5000/api/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Car listed successfully!");
      reset();
      setImageFiles([]);
      setPreviewImages([]);
    } catch (error) {
      console.error(error);
      setError("Failed to upload car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border border-gray-700 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Add New Car</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select {...register("categoryId", { required: true })} className="w-full border px-3 py-2 rounded-md">
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Registration No</label>
          <input
            type="text"
            {...register("registrationNo", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Brand</label>
          <input
            type="text"
            {...register("brand", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Model</label>
          <input
            type="text"
            {...register("model", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price Per Day (Ksh)</label>
          <input
            type="number"
            {...register("pricePerDay", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mileage</label>
          <input
            type="number"
            {...register("mileage", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Color</label>
          <input
            type="text"
            {...register("color", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>

        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((image, index) => (
              <img key={index} src={image} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          {loading ? "Uploading..." : "Submit Car"}
        </button>
      </form>
    </div>
  );
};

export default CreateCar;
