import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * ✅ Create a car (only admin can verify and create)
 */
export const createCar = async (req, res) => {
  try {
    const {
      ownerId,
      categoryId,
      registrationNo,
      ownerName,
      brand,
      model,
      images,
      pricePerDay,
      pricePerMonth,
      pricePer3Months,
      pricePer6Months,
      pricePerYear,
      mileage,
      color,
      description,
    } = req.body;

    // Admin verification check
    if (req.user.role !== "CAR_OWNER") {
      return res.status(403).json({ error: "Access denied. CarOwner privileges required." });
    }

    // Ensure at least one price is provided
    if (![pricePerDay, pricePerMonth, pricePer3Months, pricePer6Months, pricePerYear].some(Boolean)) {
      return res.status(400).json({ error: "At least one price must be provided." });
    }

    // Create car (set `isApproved` to false by default until admin approves)
    const car = await prisma.car.create({
      data: {
        ownerId,
        categoryId,
        registrationNo,
        ownerName,
        brand,
        model,
        images,
        pricePerDay,
        pricePerMonth,
        pricePer3Months,
        pricePer6Months,
        pricePerYear,
        mileage,
        color,
        description,
        isApproved: false, // Admin verification required
      },
    });

    res.status(201).json({ car, message: "Car created. Waiting for admin verification." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating car." });
  }
};

/**
 * ✅ Get car details by ID
 */
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch car by ID
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
// get all cars
export const getAllCars = async (req, res) =>{
  try{
    const cars = await prisma.car.findMany();
    res.json(cars);
  }catch(error){
    console.log(error);
    res.status(500).json({error: "Error fetching  cars"});
  }
}
/**
 * ✅ Admin only: Verify the car
 */
export const verifyCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Admin verification check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    // Verify the car (approve)
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

/**
 * ✅ Admin only: Update car details
 */
export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      registrationNo,
      ownerName,
      brand,
      model,
      pricePerDay,
      pricePerMonth,
      pricePer3Months,
      pricePer6Months,
      pricePerYear,
      mileage,
      color,
      description,
    } = req.body;

    // Admin verification check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    // Update car
    const car = await prisma.car.update({
      where: { id: parseInt(id) },
      data: {
        registrationNo,
        ownerName,
        brand,
        model,
        pricePerDay,
        pricePerMonth,
        pricePer3Months,
        pricePer6Months,
        pricePerYear,
        mileage,
        color,
        description,
      },
    });

    res.json({ car, message: "Car details updated." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating car." });
  }
};

/**
 * ✅ Admin only: Update car hire status
 */
export const updateCarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHired } = req.body;

    // Admin verification check
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    // Update car status
    const car = await prisma.car.update({
      where: { id: parseInt(id) },
      data: { isHired : true},
    });

    res.json({ car, message: `Car hire status updated to ${isHired ? "hired" : "available"}.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating car status." });
  }
};

export const deleteCar  = async (req, res) =>{
  try{
    const { id } = req.params;

    await prisma.car.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Car deleted successfully" });

  }catch(error){
    console.log(error);
    res.status(500).json({error: "Error deleting car"})
  }
}