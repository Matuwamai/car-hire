import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBook, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { AuthContext } from "../context/authContext";

const BookPage = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      console.log("Fetched car details:", data);
      if (data) {
        setCar(data);
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
      const response = await fetch(`http://localhost:5000/api/bookings/${carId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ carId, startDate, endDate }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Booking successful! Total price: Ksh ${data.totalPrice}`);
        navigate("/bookings");
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {car ? (
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-2">{car.brand} {car.model}</h2>

          <img
            src={car?.images?.length > 0 ? car.images[0].url : "/default-car.png"}
            alt="Car"
            className="w-full h-48 object-cover rounded-lg"
          />

          <p className="mt-4 text-lg font-semibold">Price per day: <span className="text-green-600">Ksh {car.pricePerDay}</span></p>
          <p className="mt-2">Mileage: {car.mileage} km</p>
          <p className="mt-2">Color: {car.color}</p>
          <p className="mt-2">Description: {car.description}</p>

          {/* Hired Status */}
          {car.isHired && car.bookings?.length > 0 ? (
            <div className="mt-4 p-3 bg-red-100 border border-red-500 rounded-lg flex items-center">
              <FaExclamationTriangle className="text-red-600 mr-2" size={20} />
              <div>
                <p className="text-red-600 font-semibold">This car is already hired.</p>
                <p className="text-gray-700 text-sm">
                  Booked from <span className="font-bold">{new Date(car.bookings[0].startDate).toLocaleDateString()}</span> to{" "}
                  <span className="font-bold">{new Date(car.bookings[0].endDate).toLocaleDateString()}</span>.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Booking Form */}
              <div className="mt-4">
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  disabled={car.isHired}
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
                  disabled={car.isHired}
                />
              </div>

              <div className="mt-4">
                <button
                  onClick={handleBookingRequest}
                  disabled={isBooking || !startDate || !endDate || car.isHired}
                  className={`w-full text-white p-2 rounded-lg flex items-center justify-center ${
                    car.isHired ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isBooking ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <FaBook size={20} className="mr-2" /> {car.isHired ? "Car Unavailable" : "Book It"}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">Loading car details...</p>
      )}
    </div>
  );
};

export default BookPage;
