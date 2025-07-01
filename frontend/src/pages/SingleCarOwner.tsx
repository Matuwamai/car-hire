import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { BASE_URL } from "@/base_url";
type CarImage = {
  id: number;
  carId: number;
  url: string;
};

type Car = {
  id: number;
  registrationNo: string;
  brand: string;
  model: string;
  pricePerDay: number;
  mileage: number;
  color: string;
  description: string;
  isApproved: boolean;
  isHired: boolean;
  images: CarImage[];
};

type CarOwner = {
  id: number;
  phone: string;
  idNumber: string;
  address: string;
  user: {
    name: string;
    email: string;
    profileImage?: string;
  };
  cars: Car[];
};

const CarOwnerPage = () => {
  const { id } = useParams();
  const [carOwner, setCarOwner] = useState<CarOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const fetchCarOwner = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/carowners/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${user?.token}`,
                "Content-Type": "application/json",
              },
        }
            
        );
        const data = await res.json();
        setCarOwner(data);
      } catch (err) {
        console.error("Failed to fetch car owner", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarOwner();
  }, [id]);

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;

  if (!carOwner)
    return <div className="p-4 text-red-500">Car owner not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h1 className="text-2xl font-semibold mb-2">Car Owner Details</h1>
        <p><strong>Name:</strong> {carOwner.user.name}</p>
        <p><strong>Email:</strong> {carOwner.user.email}</p>
        <p><strong>Phone:</strong> {carOwner.phone}</p>
        <p><strong>ID Number:</strong> {carOwner.idNumber}</p>
        <p><strong>Address:</strong> {carOwner.address}</p>
      </div>
      <h2 className="text-xl font-bold mb-4">Cars Owned</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carOwner.cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-2xl shadow p-4 border hover:shadow-md transition"
          >
            <img
              src={`http://localhost:5000/${car.images[0]?.url.replace(/\\/g, "/")}`}
              alt={car.brand}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-lg font-semibold">
              {car.brand} {car.model}
            </h3>
            <p><strong>Reg No:</strong> {car.registrationNo}</p>
            <p><strong>Price/Day:</strong> KES {car.pricePerDay}</p>
            <p><strong>Mileage:</strong> {car.mileage} km</p>
            <p><strong>Color:</strong> {car.color}</p>
            <p className="mt-2 text-gray-600">{car.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarOwnerPage;
