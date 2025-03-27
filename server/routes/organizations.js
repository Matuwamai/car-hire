import express from "express";
import {
  registerOrganization,
  loginOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  verifyOrganization 
} from "../controllers/organizations.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware";



const router = express.Router();

// Organization routes
router.post("/register", registerOrganization);
router.post("/login", loginOrganization);
router.get("/", getAllOrganizations);
router.get("/:id", getOrganizationById);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);
router.patch("/verify/:id", authenticate, authorizeRoles(["ADMIN"]), verifyOrganization);


export default router;
