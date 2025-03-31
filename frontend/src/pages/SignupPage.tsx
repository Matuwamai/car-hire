import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; // Using ShadCN UI
import { Link, redirect, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    idNumber: "",
    registrationNo: "",
    license: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setRole(value);
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    

    if (!formData.name || !formData.email || !formData.password || !role) {
      setError("All required fields must be filled.");
      setLoading(false);
      return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
  
        setSuccess("Account created successfully!");
        navigate("/login")
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      } navigate("/login")
      
    };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg p-6 bg-white rounded-2xl">
        <CardHeader>
          <h2 className="text-xl font-bold text-blue-600 text-center">Sign Up</h2>
        </CardHeader>
        <CardContent>
          {error && <Alert className="text-red-600 flex font-bold mb-2">{error}</Alert>}
          {success && <Alert className="text-green-600 flex font-bold mb-2">{success}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" placeholder="Full Name" onChange={handleChange} required />
            <Input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <Input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <Select onValueChange={handleRoleChange} required>
              <SelectTrigger className="w-full border p-2 rounded-md bg-white shadow-sm">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white shadow-lg rounded-md mt-1 border">
                <SelectItem className="px-4 py-2 hover:bg-blue-100 cursor-pointer" value="CAR_OWNER">
                  Car Owner
                </SelectItem>
                <SelectItem className="px-4 py-2 hover:bg-blue-100 cursor-pointer" value="ORGANIZATION">
                  Organization
                </SelectItem>
              </SelectContent>
            </Select>

            {role === "CAR_OWNER" && (
              <>
                <Input name="phone" placeholder="Phone Number" onChange={handleChange} required />
                <Input name="address" placeholder="Address" onChange={handleChange} required />
                <Input name="idNumber" placeholder="ID Number" onChange={handleChange} required />
              </>
            )}

            {role === "ORGANIZATION" && (
              <>
                <Input name="registrationNo" placeholder="Registration Number" onChange={handleChange} required />
                <Input name="license" placeholder="License" onChange={handleChange} required />
              </>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <p className="text-sm text-center mt-4">
          Aready have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </Card>
      
    </div>
  );
};

export default SignupPage;
