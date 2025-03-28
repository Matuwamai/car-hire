import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  try {
    const { role, email, password, name, profileImage, phone, address, registrationNo, license } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (role === "admin") {
      user = await prisma.admin.create({
        data: { email, password: hashedPassword },
      });
    } else if (role === "carOwner") {
      user = await prisma.carOwner.create({
        data: {
          name, 
          email,
          password: hashedPassword,
          profileImage,
          phone,
          address
        },
      });
    } else if (role === "organization") {
      user = await prisma.organization.create({
        data: {
          profileImage,
          license,
          registrationNo, 
          email,
          password: hashedPassword,
          isVerified: false, 
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    res.status(201).json({ message: `${role} created successfully`, user });
  } catch (error) {
    console.error("User Creation Error:", error);
    res.status(500).json({ error: error.message || "Error creating user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};
