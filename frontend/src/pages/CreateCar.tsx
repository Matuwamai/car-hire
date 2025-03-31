import { useState, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context/authContext";
interface CarFormData {
  ownerId: string;
  categoryId: string;
  registrationNo: string;
  ownerName: string;
  brand: string;
  model: string;
  images: FileList;
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

  // Handle form submission
  const onSubmit = async (data: CarFormData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("ownerId", data.ownerId);
      formData.append("categoryId", data.categoryId);
      formData.append("registrationNo", data.registrationNo);
      formData.append("ownerName", data.ownerName);
      formData.append("brand", data.brand);
      formData.append("model", data.model);
      formData.append("pricePerDay", String(data.pricePerDay));
      formData.append("mileage", String(data.mileage));
      formData.append("color", data.color);
      formData.append("description", data.description);

      // Append multiple images
      for (const file of Array.from(data.images)) {
        formData.append("images", file);
      }

       const { user } = useContext(AuthContext);

      await axios.post("http://localhost:5000/api/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      alert("Car listed successfully!");
      reset();
      setPreviewImages([]);
    } catch (error) {
      setError("Failed to upload car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image previews
  const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(filesArray);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border-1 border-gray-700 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Add New Car</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Registration No</label>
          <input
            type="text"
            {...register("registrationNo", { required: true })}
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Owner Name</label>
          <input
            type="text"
            {...register("ownerName", { required: true })}
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
          <label className="block text-sm font-medium">Price Per Day ($)</label>
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
          <label className="block text-sm font-medium outline-blue-600">Color</label>
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

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium">Upload Images</label>
          <input
            type="file"
            {...register("images")}
            multiple
            accept="image/*"
            className="w-full border px-3 py-2 rounded-md outline-blue-600"
            onChange={handleImagePreview}
          />
        </div>

        {/* Image Preview */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((image, index) => (
              <img key={index} src={image} alt="Preview" className="w-full h-24 object-cover rounded-md" />
            ))}
          </div>
        )}

        {/* Submit Button */}
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
