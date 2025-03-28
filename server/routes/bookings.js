import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/bookings.js";
import {  authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Protect all routes with admin authentication
router.post("/", authenticate, authorizeRoles(["ORGANIZATION"]), createBooking);
router.get("/", authenticate, authorizeRoles(["ADMIN"]), getAllBookings);
router.get("/:id", authenticate, authorizeRoles(["ADMIN", "ORGANIZATION"]), getBookingById);
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updateBooking);
router.delete("/:id", authenticate, authorizeRoles(["ADMIN"]),  deleteBooking);

export default router;
