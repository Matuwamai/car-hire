import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/bookings.js";
import {  authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.post("/:carId", authenticate, authorizeRoles(["ORGANIZATION"]), createBooking);
router.get("/", authenticate, authorizeRoles(["ADMIN"]), getAllBookings);
router.get("/:id", authenticate, authorizeRoles(["ADMIN", "ORGANIZATION"]), getBookingById);
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updateBooking);
router.delete("/:id", authenticate, authorizeRoles(["ADMIN"]),  deleteBooking);

export default router;
