import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";

interface CarImage {
  id: number;
  url: string;
}

interface Car {
  id: number;
  brand: string;
  model: string;
  registrationNo: string;
  color: string;
  pricePerDay: number;
  mileage: number;
  description: string;
  images: CarImage[];
}

const OwnerCarsPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);
  useEffect(() => {
    const fetchCars = async () => {
      if (!user?.token) return;
  
      try {
        const res = await fetch(`http://localhost:5000/api/cars/owner/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCars();
  }, [user]);
  
  if (loading) return <div className="p-4">Loading cars...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Cars</h2>

      {cars.length === 0 ? (
        <p>No cars found for this owner.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="border rounded-lg shadow p-4">
              <img
                src={car.images?.length > 0 ? car.images[0].url : "/default-car.png"}
                alt="Car"
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-gray-600">{car.registrationNo}</p>
              <p className="text-sm">Color: {car.color}</p>
              <p className="text-sm">Mileage: {car.mileage} km</p>
              <p className="text-sm">Ksh {car.pricePerDay} per day</p>
              <p className="text-xs mt-1 text-gray-500">{car.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerCarsPage;
