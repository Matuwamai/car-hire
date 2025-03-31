import express from "express";
import {
  getAllCarOwners,
  getCarOwnerById,
  updateCarOwner,
  deleteCarOwner,
} from "../controllers/carOwner.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";


const router = express.Router();
router.get("/", authenticate, getAllCarOwners);
router.get("/:id", authenticate, getCarOwnerById);
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updateCarOwner);
router.delete("/:id",authenticate, authorizeRoles(["ADMIN"]), deleteCarOwner);

export default router;
