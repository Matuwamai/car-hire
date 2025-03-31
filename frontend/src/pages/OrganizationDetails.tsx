import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const OrganizationDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) {
      fetchOrganization();
    } else {
      setError("User not authenticated. Please log in.");
      setLoading(false);
    }
  }, [user?.token]);

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/organizations/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch organization");

      const data = await response.json();
      setOrganization(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white mt-5 border-1 border-gray-600 shadow-lg rounded-lg">
      {/* Organization Header */}
      <div className="flex items-center gap-4">
        <img
          src={organization?.user?.profileImage || "/default-avatar.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold">{organization?.user?.name}</h2>
          <p className="text-gray-600">{organization?.user?.email}</p>
          <p className="text-sm text-gray-500">Role: {organization?.user?.role}</p>
          <p className="text-sm text-gray-500">License: {organization?.license || "N/A"}</p>
          <p className="text-sm text-gray-500">Joined: {new Date(organization?.user?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Verification Status */}
      <div className="mt-4">
        {organization?.isVerified ? (
          <p className="text-green-600 font-bold">✔ Verified</p>
        ) : (
          <button
            onClick={() => handleVerify(organization?.id)}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Verify Organization
          </button>
        )}
      </div>

      {/* Booking History */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Booking History</h3>
        {organization?.bookings?.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">End Date</th>
                <th className="border px-4 py-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {organization.bookings.map((booking) => (
                <tr key={booking.id} className="text-center border">
                  <td className="border px-4 py-2">{booking.id}</td>
                  <td className="border px-4 py-2">{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">${booking.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetail;
