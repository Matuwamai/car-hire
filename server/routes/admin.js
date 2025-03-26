import express from "express";
import { createAdmin, loginAdmin } from "../controllers/admin.js";

const router = express.Router();

// Route to create an admin account
router.post("/register", createAdmin);

// Route to login an admin
router.post("/login", loginAdmin);

export default router;
