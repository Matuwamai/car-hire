import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";

interface CarImage {
  id: number;
  url: string;
}

interface Booking {
  id: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
  organization?: {
    user?: {
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

const OwnerCarBookingDetailPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      if (!user?.token) {
        setErrorMessage("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/cars/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setErrorMessage("Failed to load booking details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, user]);

  if (loading) return <div className="p-6">Loading booking details...</div>;
  if (errorMessage) return <div className="p-6 text-red-500">{errorMessage}</div>;
  if (!car) return <div className="p-6">Car not found.</div>;
  if (!car.bookings || car.bookings.length === 0)
    return <div className="p-6">No bookings found for this car.</div>;

  const booking = car.bookings[0];

  if (!booking.organization?.user) {
    return <div className="p-6">Booking info is incomplete.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

      <div className="border rounded-lg shadow p-4 mb-6">
        <img
          src={car.images?.[0]?.url || "/default-car.png"}
          alt="Car"
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h3 className="text-xl font-semibold">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{car.registrationNo}</p>
        <p className="text-sm">Color: {car.color}</p>
        <p className="text-sm">Mileage: {car.mileage} km</p>
        <p className="text-sm">Ksh {car.pricePerDay} per day</p>
        <p className="text-xs mt-1 text-gray-500">{car.description}</p>
      </div>

      <div className="border rounded-lg shadow p-4">
        <h4 className="text-lg font-semibold mb-2">Booking Information</h4>
        <p className="text-sm">
          Start Date: {new Date(booking.startDate).toDateString()}
        </p>
        <p className="text-sm">
          End Date: {new Date(booking.endDate).toDateString()}
        </p>
        <p className="text-sm mb-4">Total Price: Ksh {booking.totalPrice}</p>

        <h4 className="text-lg font-semibold mb-2">Booked By (Organization)</h4>
        <div className="flex items-center gap-3">
          {booking.organization.user.profileImage ? (
            <img
              src={booking.organization.user.profileImage}
              alt="Org Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              {booking.organization.user.name?.[0] || "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{booking.organization.user.name}</p>
            <p className="text-xs text-gray-600">{booking.organization.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerCarBookingDetailPage;
