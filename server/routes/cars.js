import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import {
  createCar,
  getCarById,
  verifyCar,
  updateCar,
  updateCarStatus,
} from "../controllers/cars.js";

const router = express.Router();

// Route for creating a car (Admin only)
router.post("", authenticate, authorizeRoles(["CAR_OWNER"]), createCar);

// Route for getting car details by ID
router.get("/:id", getCarById);

// Route for verifying a car (Admin only)
router.patch("/verify/:id", authenticate, authorizeRoles(["ADMIN"]), verifyCar);

// Route for updating car details (Admin only)
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updateCar);

// Route for updating car hire status (Admin only)
router.patch("/:id/status", authenticate, authorizeRoles(["ADMIN"]), updateCarStatus);

export default router;
