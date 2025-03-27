import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Register Car Owner
export const registerCarOwner = async (req, res) => {
  try {
    const { name, phone, idNumber, email, password, profileImage, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const carOwner = await prisma.carOwner.create({
      data: {
        name,
        phone,
        idNumber,
        email,
        profileImage,
        password: hashedPassword,
        address,
      },
    });

    res.status(201).json({ message: "Car owner registered successfully", carOwner });
  } catch (error) {
    console.error("Registration Error:", error); // Log the actual error
    res.status(500).json({ error: error.message || "Error registering car owner" });
  }
};


// Login Car Owner
export const loginCarOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const carOwner = await prisma.carOwner.findUnique({ where: { email } });
    if (!carOwner) return res.status(404).json({ error: "Car owner not found" });

    const isMatch = await bcrypt.compare(password, carOwner.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: carOwner.id , role:carOwner.role}, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

// Get all Car Owners
export const getAllCarOwners = async (req, res) => {
  try {
    const carOwners = await prisma.carOwner.findMany();
    res.status(200).json(carOwners);
  } catch (error) {
    res.status(500).json({ error: "Error fetching car owners" });
  }
};

// Get a Single Car Owner
export const getCarOwnerById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convert id to a number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const carOwner = await prisma.carOwner.findUnique({ where: { id } });
    if (!carOwner) return res.status(404).json({ error: "Car owner not found" });
    res.status(200).json(carOwner);
  } catch (error) {
    res.status(500).json({ error: "Error fetching car owner" });
  }
};

// Update Car Owner
export const updateCarOwner = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convert id to a number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const updatedCarOwner = await prisma.carOwner.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ message: "Car owner updated successfully", updatedCarOwner });
  } catch (error) {
    res.status(500).json({ error: "Error updating car owner" });
  }
};

// Delete Car Owner
export const deleteCarOwner = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convert id to a number
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await prisma.carOwner.delete({ where: { id } });
    res.status(200).json({ message: "Car owner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting car owner" });
  }
};
