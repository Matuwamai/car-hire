import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/carCategory.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js"; // Import middleware

const router = express.Router();

// Public: Get all categories
router.get("/", getAllCategories);

// Public: Get a category by ID
router.get("/:id", getCategoryById);

// Admin-only: Create a new category
router.post("/", authenticate, authorizeRoles(["ADMIN"]), createCategory);

// Admin-only: Update a category
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updateCategory);

// Admin-only: Delete a category
router.delete("/:id", authenticate, authorizeRoles(["ADMIN"]), deleteCategory);

export default router;
