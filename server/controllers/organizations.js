import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { prisma } from "../config/prismaClient.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Register Organization
export const registerOrganization = async (req, res) => {
  try {
    const { name, registrationNo, license, email, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const organization = await prisma.organization.create({
      data: {
        name,
        registrationNo,
        license,
        email,
        password: hashedPassword,
        isVerified: false, // Admin must verify first
      },
    });
    res.status(201).json({ message: "Organization registered successfully. Awaiting admin verification.", organization });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message || "Error registering organization" });
  }
};

// Login Organization
export const loginOrganization = async (req, res) => {
  try {
    const { email, password } = req.body;
    const organization = await prisma.organization.findUnique({ where: { email } });
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    const validPassword = await bcrypt.compare(password, organization.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!organization.isVerified) {
      return res.status(403).json({ error: "Organization not verified by admin" });
    }
    const token = jwt.sign({ id: organization.id, email: organization.email,  role: organization.role}, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message || "Error logging in" });
  }
};
// Get all Organizations
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching organizations" });
  }
};

// Get single Organization by ID
export const getOrganizationById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convert id to a number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const organization = await prisma.organization.findUnique({ where: { id } });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Error fetching organization" });
  }
};


// Update Organization
export const updateOrganization = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convert id to a number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: req.body,
    });
    res.json({ message: "Organization updated successfully", updatedOrganization });
  } catch (error) {
    res.status(500).json({ error: "Error updating organization" });
  }
};

// Delete Organization
export const deleteOrganization = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convert id to a number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await prisma.organization.delete({ where: { id } });
    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting organization" });
  }
};
export const verifyOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the requester is an admin
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Find the organization
    const organization = await prisma.organization.findUnique({
      where: { id: Number(id) },
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Update verification status
    await prisma.organization.update({
      where: { id: Number(id) },
      data: { isVerified: true },
    });

    return res.status(200).json({ message: "Organization verified successfully" });
  } catch (error) {
    console.error("Error verifying organization:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

