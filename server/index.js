import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import carOwnerRoutes from "./routes/carOwner.js"
import organizationsRoutes from "./routes/organizations.js"
import carsRoutes from "./routes/cars.js"
import categoryRoutes from "./routes/category.js";



dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/carowners", carOwnerRoutes);
app.use("/api/organizations", organizationsRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/categories", categoryRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
