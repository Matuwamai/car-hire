import express from "express";
import {
  registerOrganization,
  loginOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from "../controllers/organizations.js";

const router = express.Router();

// Organization routes
router.post("/register", registerOrganization);
router.post("/login", loginOrganization);
router.get("/", getAllOrganizations);
router.get("/:id", getOrganizationById);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);

export default router;
