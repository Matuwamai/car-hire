import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    // console.log("🔍 Received Token:", token); 

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Token is missing." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(" Decoded Token:", decoded); 
    req.user = decoded; 
    next();
  } catch (error) {
    console.error(" Authentication error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
