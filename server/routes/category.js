import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategories
} from "../controllers/carCategory.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.get("/", getAllCategories);
router.get("/categories", getCategories);
router.get("/:id", getCategoryById);
router.post("/", authenticate, authorizeRoles(["ADMIN"]), createCategory);
router.put("/:id", authenticate, authorizeRoles(["ADMIN"]), updateCategory);
router.delete("/:id", authenticate, authorizeRoles(["ADMIN"]), deleteCategory);

export default router;
