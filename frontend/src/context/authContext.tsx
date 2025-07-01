import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
interface AuthContextType {
  user: { id: string; role: string; token: string; name: string} | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const userFromLocalstorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ): null
  const [user, setUser] = useState<{ id: string; role: string; token: string; name: string } | null>(userFromLocalstorage);

  const BASE_URL =` http://localhost:8000/api`
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/users/login`, { email, password });
      const { token } = res.data;

      if (token) {
        const decodedToken: any = jwtDecode(token);
        const userData = {
          id: decodedToken.id, 
          role: decodedToken.role, 
          name:  decodedToken.name,
          token
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); 
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.log("Login failed", error);
      throw new Error("Invalid email or password");
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); 
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};




