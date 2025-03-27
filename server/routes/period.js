import express from "express";
import {
  createPeriod,
  getAllPeriods,
  getPeriodById,
  updatePeriod,
  deletePeriod,
} from "../controllers/period.js";
import {  authenticate, authorizeRoles } from "../middleware/auth.js";


const router = express.Router();

// Protect all routes with admin authentication
router.post("/", authenticate,  authorizeRoles(["ADMIN"]), createPeriod);
router.get("/", authenticate, getAllPeriods);
router.get("/:id", authenticate, getPeriodById);
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updatePeriod);
router.delete("/:id",authenticate, authorizeRoles(["ADMIN"]), deletePeriod);

export default router;
