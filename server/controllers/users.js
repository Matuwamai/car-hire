import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export const createUser = async (req, res) => {
  try {
    const {
      role,
      email,
      password,
      name,
      profileImage,
      phone,
      address,
      idNumber,
      registrationNo,
      license,
    } = req.body;

    // ✅ Validate required fields
    if (!role || !email || !password) {
      return res.status(400).json({ error: "Role, email, and password are required" });
    }

    // ✅ Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use. Please use a different email." });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role, 
        profileImage,
      },
    });

    let userDetails;

    if (role === "CAR_OWNER") {
      // ✅ Check if ID number already exists
      const existingCarOwner = await prisma.carOwner.findUnique({ where: { idNumber } });
      if (existingCarOwner) {
        return res.status(400).json({ error: "ID Number is already in use. Please use a different one." });
      }

      userDetails = await prisma.carOwner.create({
        data: {
          userId: user.id, 
          phone,
          address,
          idNumber,
        },
      });
    } else if (role === "ORGANIZATION") {
      // ✅ Check if registration number already exists
      const existingOrg = await prisma.organization.findUnique({ where: { registrationNo } });
      if (existingOrg) {
        return res.status(400).json({ error: "Registration number already exists. Please use a different one." });
      }

      userDetails = await prisma.organization.create({
        data: {
          userId: user.id,
          registrationNo,
          license,
          isVerified: false,
        },
      });
    }

    res.status(201).json({ message: `${role} created successfully`, user, userDetails });

  } catch (error) {
    console.error("User Creation Error:", error);
    res.status(500).json({ error: error.message || "Error creating user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log(req.body)
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
 
export const getAllUsers = async(req,res) =>{
  try{
 const users = await prisma.user.findMany();
 res.status(200).json(users);
  }catch(error){
  console.log(error);
  res.status(500).json({error: "Error fetching users"})
}
};