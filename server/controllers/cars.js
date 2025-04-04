import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const createCar = async (req, res) => {
  try {
    const {
      categoryId,
      registrationNo,
      brand,
      model,
      pricePerDay,
      mileage,
      color,
      description,
      ownerName,
    } = req.body;

    const ownerId = req.user?.id;
    if (!ownerId) return res.status(400).json({ message: "Owner ID is required" });

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const car = await prisma.car.create({
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
        ownerName,
        images: {
          create: imageUrls.map(url => ({ url })),
        },
      },
      include: { images: true },
    });

    res.status(201).json(car);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const BASE_URL = "http://localhost:5000";

// Helper function to map images with full URL
const attachImageUrls = (car) => {
  return {
    ...car,
    images: car.images.map((img) => ({
      ...img,
      url: `${BASE_URL}${img.url.startsWith("/") ? "" : "/"}${img.url}`,
    })),
  };
};

// GET all cars with image URLs
export const getAllCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      include: {
        images: true,
      },
    });

    const carsWithUrls = cars.map(attachImageUrls);
    res.status(200).json(carsWithUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
};

// GET car by ID with image URLs
export const getCarById = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        images: true,
      },
    });

    if (!car) return res.status(404).json({ message: "Car not found" });

    res.status(200).json(attachImageUrls(car));
  } catch (error) {
    res.status(500).json({ message: "Error fetching car" });
  }
};

// GET cars by owner ID with image URLs
export const getCarsByOwner = async (req, res) => {
  try {
    const ownerId = Number(req.params.ownerId);
    const cars = await prisma.car.findMany({
      where: { ownerId },
      include: {
        images: true,
      },
    });

    const carsWithUrls = cars.map(attachImageUrls);
    res.status(200).json(carsWithUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars for owner" });
  }
};



// VERIFY a car (admin action)
export const verifyCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCar = await prisma.car.update({
      where: { id: Number(id) },
      data: { isApproved: true },
    });

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Error verifying car" });
  }
};

// UPDATE car
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      registrationNo,
      brand,
      model,
      pricePerDay,
      mileage,
      color,
      description,
      ownerName,
    } = req.body;

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const updatedCar = await prisma.car.update({
      where: { id: Number(id) },
      data: {
        registrationNo,
        brand,
        model,
        pricePerDay: Number(pricePerDay),
        mileage: Number(mileage),
        color,
        description,
        ownerName,
        images: imageUrls.length > 0 ? imageUrls : undefined, // Only update if images exist
      },
    });

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Error updating car" });
  }
};

// DELETE car
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.car.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car" });
  }
};