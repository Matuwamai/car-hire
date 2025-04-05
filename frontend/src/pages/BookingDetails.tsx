import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

const SingleBookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
        });
        const data = await res.json();
        setBooking(data);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      alert("Booking status updated successfully");
      setBooking(data);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      alert("Booking deleted successfully");
      navigate("/bookings");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (loading) return <div className="p-4">Loading booking details...</div>;

  if (!booking) return <div className="p-4 text-red-500">Booking not found.</div>;

  const car = booking?.car;
  const org = booking?.organization;
  const orgUser = org?.user;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

      <div className="flex gap-6">
        {car?.images?.[0]?.url && (
          <img
            src={`http://localhost:5000/${car.images[0].url.replace(/\\/g, "/")}`}
            alt="Car"
            className="w-64 h-48 object-cover rounded-lg shadow"
          />
        )}

        <div className="flex flex-col gap-1">
          <p><strong>Car:</strong> {car?.brand} {car?.model} ({car?.registrationNo})</p>
          <p><strong>Owner:</strong> {car?.ownerName}</p>
          <p><strong>Color:</strong> {car?.color}</p>
          <p><strong>Price per day:</strong> Ksh {car?.pricePerDay}</p>
          <p><strong>Mileage:</strong> {car?.mileage} km</p>
          <p><strong>Description:</strong> {car?.description}</p>
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2">Booking Information</h3>
        {orgUser && (
          <p><strong>Booked by:</strong> {orgUser?.name} ({orgUser?.email})</p>
        )}
        <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
        <p><strong>Total Price:</strong> Ksh {booking.totalPrice}</p>
        <p><strong>Status:</strong> {booking.status}</p>

        <div className="mt-4 flex gap-4">
          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleBookingPage;
