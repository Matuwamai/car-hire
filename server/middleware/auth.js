import jwt from "jsonwebtoken";
import dotenv from "dotenv";
 // REMOVE THIS LINE (not needed in JS)

dotenv.config();

/**
 * ✅ Authenticate any user (Admin, Car Owners, Organizations)
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Token is missing." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
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
