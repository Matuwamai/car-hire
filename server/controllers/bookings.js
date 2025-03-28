import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export const createBooking = async (req, res) => {
  try {
    const { carId, organizationId,  startDate, endDate } = req.body;
    if (!carId || !organizationId ||  !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required for booking" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    const { pricePerDay } = car;
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * pricePerDay;
    const existingBooking = await prisma.booking.findFirst({
      where: { carId, isActive: true },
    });

    if (existingBooking) {
      return res.status(400).json({ error: "This car is already booked and currently in use." });
    }
    const booking = await prisma.booking.create({
      data: {
        carId,
        organizationId,
        totalPrice, 
        startDate: start,
        endDate: end,
        isActive: true, 
      },
    });
    await prisma.car.update({
      where: { id: carId },
      data: { isHired: true },
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
      totalDays,
      pricePerDay,
      totalPrice,
    });
  } catch (error) {
    console.error("Booking Creation Error:", error);
    res.status(500).json({ error: error.message || "Error creating booking" });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { car: true, organization: true, period: true },
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { car: true, organization: true, period: true },
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await prisma.car.update({
      where: { id: booking.carId },
      data: { isHired: false },
    });

    await prisma.booking.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
