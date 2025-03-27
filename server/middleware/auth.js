import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * ✅ Authenticate any user (Admin, Car Owners, Organizations)
 */
export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    // Verify the token and decode user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

/**
 * ✅ Role-based authorization middleware
 * @param {string[]} roles - Allowed roles (e.g., ["ADMIN"], ["CAR_OWNER", "ORGANIZATION"])
 */
export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
