import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  car: {
    brand: string;
    model: string;
    registrationNo: string;
    images: { url: string }[];
  };
  organization: {
    user: { name: string };
  };
}
const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
 const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    if (user?.token) {
      fetchBookings();
    }
  }, [user?.token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Bookings</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl shadow p-4 flex gap-4"
          >
            <img
              src={`http://localhost:5000/${booking.car.images[0]?.url}`}
              alt="Car"
              className="w-40 h-28 object-cover rounded-xl"
            />
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-lg font-semibold">
                  {booking.car.brand} {booking.car.model}
                </h3>
                <p className="text-gray-600">Reg No: {booking.car.registrationNo}</p>
                <p className="text-gray-600">
                  Hired by: {booking.organization.user.name}
                </p>
                <p className="text-gray-600">
                  {new Date(booking.startDate).toLocaleDateString()} to{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p className="text-green-600 font-bold">
                  Total: Ksh {booking.totalPrice}
                </p>
              </div>
              <button
                onClick={() => navigate(`/booking/${booking.id}`)}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
