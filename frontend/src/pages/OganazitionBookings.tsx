import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext"; 
import { BASE_URL } from "@/base_url";
interface Image {
  id: number;
  carId: number;
  url: string;
}
interface Car {
  id: number;
  registrationNo: string;
  brand: string;
  model: string;
  images: Image[];
}
interface Booking {
  id: number;
  carId: number;
  organizationId: number;
  totalPrice: number;
  status: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  car: Car;
}

const OrganizationBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const { user  } = useContext(AuthContext);
  const userId = user?.id;



  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;

      try {
        const res = await fetch(`${BASE_URL}/api/bookings/organization/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);


  if (!userId) {
    return <p className="text-red-500 text-center mt-4">User not found.</p>;
  }

  if (loading) return <p className="text-center mt-4">Loading bookings...</p>;

  return (
    <div className="p-4 grid gap-4">
      <h2 className="text-2xl font-semibold">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row items-center gap-4"
          >
            <img
              src={`${BASE_URL}/${booking.car.images[0]?.url.replace("\\", "/")}`}
              alt="Car"
              className="w-40 h-28 object-cover rounded-xl"
            />
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-bold">
                {booking.car.brand} {booking.car.model}
              </h3>
              <p className="text-gray-600">Reg No: {booking.car.registrationNo}</p>
              <p className="text-gray-600">
                Dates: {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Status: <span className="capitalize font-medium">{booking.status}</span>
              </p>
              <p className="text-gray-800 font-semibold">
                Total Price: KES {booking.totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrganizationBookings;
