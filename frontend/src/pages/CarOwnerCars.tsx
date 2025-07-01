import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { BASE_URL } from "@/base_url";

interface CarImage {
  id: number;
  url: string;
}

interface Booking {
  id: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  organization: {
    user: {
      name: string;
      email: string;
      profileImage?: string | null;
    };
  };
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
  bookings: Booking[];
}

const OwnerCarsPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      if (!user?.id || !user?.token) {
        setLoading(false); 
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/cars/owner/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch cars");
        }

        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [user?.id, user?.token]);

  if (loading) return <div className="p-4">Loading cars...</div>;

  if (!user?.id || !user?.token) {
    return <div className="p-4 text-red-500">You must be logged in to view your cars.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Cars</h2>

      {cars.length === 0 ? (
        <p>No cars found for this owner.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="border rounded-lg shadow p-4 relative">
              {car.bookings.length > 0 && (
                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Booked
                </span>
              )}
              <img
                src={car.images?.[0]?.url || "/default-car.png"}
                alt="Car"
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
              <p className="text-sm text-gray-600">{car.registrationNo}</p>
              <p className="text-sm">Color: {car.color}</p>
              <p className="text-sm">Mileage: {car.mileage} km</p>
              <p className="text-sm">Ksh {car.pricePerDay} per day</p>
              <p className="text-xs mt-1 text-gray-500">{car.description}</p>

              {car.bookings.length > 0 && (
                <button
                  onClick={() => navigate(`/owner/bookings/${car.id}`)}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                >
                  View Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerCarsPage;
