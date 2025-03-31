import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create a new car with multiple images
export const createCar = async (req, res) => {
  try {
    const { ownerId, categoryId, registrationNo, ownerName, brand, model, pricePerDay, mileage, color, description } = req.body;
    
    if (req.user.role !== "CAR_OWNER") {
      return res.status(403).json({ error: "Access denied. CarOwner privileges required." });
    }

    if (!pricePerDay) {
      return res.status(400).json({ error: "At least one price must be provided." });
    }

    // Get uploaded image filenames
    const imageUrls = req.files.map(file => `/uploads/cars/${file.filename}`);

    const car = await prisma.car.create({
      data: {
        ownerId,
        categoryId,
        registrationNo,
        ownerName,
        brand,
        model,
        images: imageUrls, // Store array of images
        pricePerDay,
        mileage,
        color,
        description,
        isApproved: false,
      },
    });

    res.status(201).json({ car, message: "Car created. Waiting for admin verification." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating car." });
  }
};

// Get a single car by ID
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

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany();
    res.json(cars);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching cars" });
  }
};

// Verify car (Admin only)
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

// Update car details
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { registrationNo, ownerName, brand, model, pricePerDay, mileage, color, description } = req.body;

    if (req.user.role !== "ADMIN" && req.user.role !== "CAR_OWNER") {
      return res.status(403).json({ error: "Access denied." });
    }

    // Handle new image uploads if provided
    let imageUrls = req.files?.map(file => `/uploads/cars/${file.filename}`) || [];

    const existingCar = await prisma.car.findUnique({ where: { id: parseInt(id) } });

    if (!existingCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    // If no new images are uploaded, keep the old ones
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
        images: imageUrls, // Update images
      },
    });

    res.json({ car, message: "Car details updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating car." });
  }
};

// Update car hire status
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

// Delete car
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
