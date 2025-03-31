import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";

const Cars = () => {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cars", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch cars");

      const data = await response.json();
      setCars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cars/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete car");

      setCars(cars.filter((car) => car.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerify = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/verify/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to verify car");

      const updatedCars = cars.map((car) =>
        car.id === id ? { ...car, isApproved: true } : car
      );
      setCars(updatedCars);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleHireStatus = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cars/status/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update car hire status");

      const updatedCars = cars.map((car) =>
        car.id === id ? { ...car, isHired: !car.isHired } : car
      );
      setCars(updatedCars);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Cars</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="bg-white shadow-md rounded-lg p-4">
            {/* Car Image */}
            <img
              src={car.image || "/default-car.png"}
              alt="Car"
              className="w-full h-40 object-cover rounded"
            />

            {/* Car Details */}
            <h3 className="text-lg font-semibold mt-2">{car.brand} {car.model}</h3>
            <p className="text-gray-600">Owner: {car.ownerName}</p>
            <p className="text-gray-600">Mileage: {car.mileage} km</p>
            <p className="text-gray-500">Color: {car.color}</p>
            <p className="text-gray-500">Registration: {car.registrationNo}</p>

            {/* Pricing */}
            <div className="mt-2">
              <p className="text-sm text-gray-500">Daily: ${car.pricePerDay}</p>
              <p className="text-sm text-gray-500">Monthly: ${car.pricePerMonth}</p>
            </div>

            {/* Verification Status */}
            <p className={`mt-2 font-bold ${car.isApproved ? "text-green-600" : "text-red-500"}`}>
              {car.isApproved ? "✔ Verified" : "❌ Not Verified"}
            </p>

            {/* Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              {/* Book Car (For Organizations) */}
              {user?.role === "ORGANIZATION" && (
                <button className="bg-blue-500 text-white py-1 px-3 rounded">
                  Book
                </button>
              )}

              {/* Verify Car (For Admins) */}
              {user?.role === "ADMIN" && !car.isApproved && (
                <button onClick={() => handleVerify(car.id)} className="bg-green-500 text-white py-1 px-3 rounded">
                  Verify
                </button>
              )}

              {/* Update Car Status (For Admins) */}
              {user?.role === "ADMIN" && (
                <button onClick={() => handleHireStatus(car.id)} className="bg-yellow-500 text-white py-1 px-3 rounded">
                  {car.isHired ? "Mark Available" : "Mark Hired"}
                </button>
              )}

              {/* Edit & Delete (For Car Owners & Admins) */}
              {(user?.role === "ADMIN" || (user?.role === "CAROWNER" && user?.id === car.ownerId)) && (
                <>
                  <button className="bg-gray-600 text-white py-1 px-3 rounded">Edit</button>
                  <button onClick={() => handleDelete(car.id)} className="bg-red-500 text-white py-1 px-3 rounded">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cars;
