import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createCar = async (req, res) => {
  try {
    const { categoryId, registrationNo, brand, model, pricePerDay, mileage, color, description } = req.body;
    const ownerId = req.user?.id; 
    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }
    const imageUrls = req.files ? req.files.map(file => file.path) : [];
    const ownerExists = await prisma.carOwner.findUnique({
      where: { id: Number(ownerId) },
    });

    if (!ownerExists) {
      return res.status(400).json({ message: "Owner does not exist" });
    }
    const newCar = await prisma.car.create({
      data: {
        ownerId: Number(ownerId),
        categoryId: Number(categoryId),
        registrationNo,
        brand,
        model,
        pricePerDay: Number(pricePerDay),
        mileage: Number(mileage),
        color,
        description,
        images: JSON.stringify(imageUrls), 
      },
    });

    res.status(201).json(newCar);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await prisma.car.findUnique({ where: { id: parseInt(id) } });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching car." });
  }
};
export const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching cars" });
  }
};
export const verifyCar = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    const car = await prisma.car.update({
      where: { id: parseInt(id) },
      data: { isApproved: true },
    });

    res.json({ car, message: "Car successfully verified and approved." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error verifying car." });
  }
};
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { registrationNo, ownerName, brand, model, pricePerDay, mileage, color, description } = req.body;

    if (req.user.role !== "ADMIN" && req.user.role !== "CAR_OWNER") {
      return res.status(403).json({ error: "Access denied." });
    }
    let imageUrls = req.files?.map(file => `/uploads/cars/${file.filename}`) || [];

    const existingCar = await prisma.car.findUnique({ where: { id: parseInt(id) } });

    if (!existingCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    if (imageUrls.length === 0) {
      imageUrls = existingCar.images;
    }

    const car = await prisma.car.update({
      where: { id: parseInt(id) },
      data: {
        registrationNo,
        ownerName,
        brand,
        model,
        pricePerDay,
        mileage,
        color,
        description,
        images: imageUrls, 
      },
    });

    res.json({ car, message: "Car details updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating car." });
  }
};
export const updateCarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHired } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    const car = await prisma.car.update({
      where: { id: parseInt(id) },
      data: { isHired: isHired },
    });

    res.json({ car, message: `Car hire status updated to ${isHired ? "hired" : "available"}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating car status." });
  }
};
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.car.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting car" });
  }
};
