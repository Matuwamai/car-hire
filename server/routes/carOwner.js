import express from "express";
import {
  registerCarOwner,
  loginCarOwner,
  getAllCarOwners,
  getCarOwnerById,
  updateCarOwner,
  deleteCarOwner,
} from "../controllers/carOwner.js";

const router = express.Router();

// Car Owner Routes
router.post("/register", registerCarOwner);
router.post("/login", loginCarOwner);
router.get("/", getAllCarOwners);
router.get("/:id", getCarOwnerById);
router.put("/:id", updateCarOwner);
router.delete("/:id", deleteCarOwner);

export default router;
