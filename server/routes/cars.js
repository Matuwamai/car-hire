import express from "express";
import {
  createCar,
  getAllCars,
  getCarById,
  verifyCar,
  updateCar,
  updateCarStatus,
  deleteCar
} from "../controllers/cars.js";
import upload from "../middlewares/upload.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.post("/", authenticate, authorizeRoles("CAR_OWNER"), upload.array("images", 5), createCar);
router.get("/", authenticate, getAllCars);
router.get("/:id", authenticate, getCarById);
router.patch("/:id", authenticate, authorizeRoles(["CAR_OWNER", "ADMIN"]), upload.array("images", 5), updateCar);
router.patch("/verify/:id", authenticate, authorizeRoles("ADMIN"), verifyCar);
router.patch("/status/:id", authenticate, authorizeRoles("ADMIN"), updateCarStatus);
router.delete("/:id", authenticate, authorizeRoles(["CAR_OWNER", "ADMIN"]), deleteCar);

export default router;
