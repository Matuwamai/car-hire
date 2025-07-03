import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { BASE_URL } from "@/base_url";

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

 // Search & Pagination State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    // if (user?.token) {
    //   fetchBookings();
    // }
  }, [user?.token, page]);
   const fetchBookings = async (searchQuery) => {
      try {
        const response = await fetch(`${BASE_URL}/api/bookings?search=${searchQuery}&page=${page}`, {
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
        setTotalPages(data.totalPages || 1);
      console.log(data)
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
        //  Handle Search
  const handleSearch = () => {
    setPage(1); // reset to first page
    fetchBookings(search);
  };
   // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };
   const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Bookings</h2>
      {/* 🆕 Search Bar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by brand, model..."
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl shadow p-4 flex gap-4"
          >
            <img
              src={`${BASE_URL}${booking.car.images[0]?.url}`}
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
       {/* 🆕 Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingsPage;
