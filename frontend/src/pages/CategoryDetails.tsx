import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/context/authContext";


interface CarImage {
  id: number;
  url: string;
}
interface Car {
  images: CarImage[];
  brand: string;
  model: string;
  isHired: boolean;
  pricePerDay: number;
  ownerName: string;
  createdAt: string;
}
interface Category {
  id: number;
  name: string;
  description: string;
  cars: Car[];
}

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p>Auth context not available</p>;
  }

  const { user } = authContext;

  useEffect(() => {
    const fetchCategory = async () => {
      if (!user?.token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setCategory(response.data);
      } catch (error: any) {
        setError("Failed to fetch category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, user?.token]);

  if (loading) return <p>Loading category...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      {category && (
        <>
          <h2 className="text-3xl font-bold text-gray-700">{category.name}</h2>
          <p className="text-gray-600 mt-2">{category.description}</p>

          <h3 className="text-2xl font-semibold mt-6">Available Cars</h3>
          {category.cars.length === 0 ? (
            <p className="text-gray-500 mt-2">No cars in this category.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {category.cars.map((car, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded shadow-md">
                  <img src={car.images?.length > 0 ? car.images[0].url : "/default-car.png"} 
                  alt={car.brand} className="w-full h-40 object-cover rounded" />
                  <h4 className="text-xl font-semibold mt-2">
                    {car.brand} {car.model}
                  </h4>
                  <p className="text-gray-600">Owner: {car.ownerName}</p>
                  <p className="text-gray-600">Price per day: ${car.pricePerDay}</p>
                  <p className={`font-bold ${car.isHired ? "text-red-600" : "text-green-600"}`}>
                    {car.isHired ? "Currently Hired" : "Available"}
                  </p>
                  <p className="text-gray-500 text-sm">Added on: {new Date(car.createdAt).toDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryDetail;
