import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { AuthContext } from "../context/authContext"; // Import the AuthContext

const BookPage = () => {
  const { carId } = useParams(); // Get the carId from the URL
  const [car, setCar] = useState<any | null>(null); // Ensure car state is nullable
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useContext(AuthContext); // Get the user object from AuthContext
  const navigate = useNavigate(); // Used for navigation after booking

  useEffect(() => {
    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/${carId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Include the token
        },
      });

      const data = await response.json();
      console.log("Fetched car details:", data); // Log the response to check the data structure
      if (data?.car) {
        setCar(data.car);
      } else {
        alert("Car details not found.");
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
      alert("An error occurred while fetching car details.");
    }
  };

  const handleBookingRequest = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates for booking.");
      return;
    }

    setIsBooking(true);
    try {
      const response = await fetch(`http://localhost:5000/api/cars/bookings/${carId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // Include the token in the header
        },
        body: JSON.stringify({
          carId,
          startDate,
          endDate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Booking successful! Total price: Ksh ${data.totalPrice}`);
        navigate("/bookings"); // Redirect to bookings page
      } else {
        const errorData = await response.json();
        alert(`Booking failed: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error booking car:", error);
      alert("An error occurred while booking the car.");
    } finally {
      setIsBooking(false);
    }
  };

  console.log("Car Object before rendering:", car);

  return (
    <div className="p-6">
      {car ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{car.brand} {car.model}</h2>

          {/* If car images are available, show the first one, otherwise show a default image */}
          <img
            src={car?.images?.length > 0 ? car.images[0].url : "/default-car.png"}
            alt="Car"
            className="w-full h-40 object-cover rounded"
          />

          <p className="mt-4">Price per day: Ksh {car.pricePerDay}</p>
          <p className="mt-2">Mileage: {car.mileage} km</p>
          <p className="mt-2">Color: {car.color}</p>
          <p className="mt-2">Description: {car.description}</p>

          {/* Booking form */}
          <div className="mt-4">
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Booking button */}
          <div className="mt-4">
            <button
              onClick={handleBookingRequest}
              disabled={isBooking || !startDate || !endDate}
              className="w-full bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center hover:bg-blue-700"
            >
              {isBooking ? (
                <span>Processing...</span>
              ) : (
                <>
                  <FaBook size={20} className="mr-2" /> Book It
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <p>Loading car details...</p>
      )}
    </div>
  );
};

export default BookPage;
