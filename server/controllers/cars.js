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

    const userId = req.user?.id;

    const carOwner = await prisma.carOwner.findUnique({
      where: { userId },
    });

    if (!carOwner) {
      return res.status(400).json({ message: "Car owner not found" });
    }

    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const car = await prisma.car.create({
      data: {
        ownerId: carOwner.id,
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
          create: imageUrls.map((url) => ({ url })),
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

const BASE_URL = "https://car-hire-w3b8.onrender.com";
const attachImageUrls = (car) => {
  return {
    ...car,
    images: car.images.map((img) => ({
      ...img,
      url: `${BASE_URL}${img.url.startsWith("/") ? "" : "/"}${img.url}`,
    })),
  };
};
export const getAllCars = async (req, res) => {
  const {search, page, limit} = req.query;
  const currentPage = parseInt(page)|| 1;
  const pageSize = parseInt(limit)|| 10;
  const skip = (currentPage - 1)* pageSize;
  const totalCars =  prisma.car.count();
  try {
    const cars = await prisma.car.findMany({
      where:{
        OR:[
          {model:{contains: search}},
          {brand:{contains: search}},
          {registrationNo:{contains: search}}
        ]
      },
      include: {
        images: true,
      },
      skip,
      take :pageSize
    });

    const carsWithUrls = cars.map(attachImageUrls);
  return  res.status(200).json({carsWithUrls}, totalCars, currentPage);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
};

export const getCarById = async (req, res) => {
  try {
    console.log("Received carId:", req.params.id);
    const carId = Number(req.params.id);
    
    if (isNaN(carId)) {
      return res.status(400).json({ message: "Invalid car ID" });
    }
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        images: true,
        bookings: {
          select: {
            startDate: true,
            endDate: true
          }
        }
      },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    const carWithImages = attachImageUrls(car);
    const carResponse = {
      ...carWithImages,
      bookings: car.isHired ? carWithImages.bookings : undefined
    };

    res.status(200).json(carResponse);

  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Error fetching car" });
  }
};


export const getCarsByOwner = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const   owner = await prisma.carOwner.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found for this user" });
    }
console.log(owner)
    const cars = await prisma.car.findMany({
      where: { owner },
      include: { images: true ,
        bookings:{
          include:{organization:{
            include:{user: true}
          }}
        }
      },
    });

    const carsWithUrls = cars.map(attachImageUrls);
    res.status(200).json(carsWithUrls);
  } catch (error) {
    console.error("Error fetching cars for owner:", error);
    res.status(500).json({ message: "Error fetching cars for owner" });
  }
};



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
        images: imageUrls.length > 0 ? imageUrls : undefined,
      },
    });

    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Error updating car" });
  }
};
export const deleteCar = async (req, res) => {
  const carId = parseInt(req.params.id);

  try {
    await prisma.$transaction([
      prisma.booking.deleteMany({
        where: { carId: carId },
      }),
      prisma.carImage.deleteMany({
        where: {carId: carId}
      }),
      prisma.car.delete({
        where: { id: carId },
      }),
    ]);

    res.status(200).json({ message: "Car and related bookings deleted" });
  } catch (err) {
    console.error("Delete car error:", err);
    res.status(500).json({ error: "Failed to delete car" });
  }
};

