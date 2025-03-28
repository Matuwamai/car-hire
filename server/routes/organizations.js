import express from "express";
import {
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  verifyOrganization 
} from "../controllers/organizations.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";



const router = express.Router();
router.get("/", authenticate, authorizeRoles(["ADMIN"]), getAllOrganizations);
router.get("/:id",authenticate, getOrganizationById);
router.put("/:id", authenticate, authorizeRoles(["ORGANIZATION"]), updateOrganization);
router.delete("/:id", authenticate, deleteOrganization);
router.patch("/verify/:id", authenticate, authorizeRoles(["ADMIN"]), verifyOrganization);


export default router;
