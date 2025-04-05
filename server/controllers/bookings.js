import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = req.user?.id;

    const organization = await prisma.organization.findUnique({
      where: { userId },
    });

    if (!carId || !organization?.id || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required for booking" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ error: "Start date must be before end date" });
    }

    const carIdInt = parseInt(carId);
    if (isNaN(carIdInt)) {
      return res.status(400).json({ error: "Invalid car ID" });
    }

    const car = await prisma.car.findUnique({ where: { id: carIdInt } });
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        carId: carIdInt,
        isActive: true,
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: "This car is already booked during the selected period." });
    }

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = totalDays * car.pricePerDay;

    const booking = await prisma.booking.create({
      data: {
        carId: carIdInt,
        organizationId: organization.id,
        totalPrice,
        startDate: start,
        endDate: end,
        isActive: true,
      },
    });

    await prisma.car.update({
      where: { id: carIdInt },
      data: { isHired: true },
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
      totalDays,
      pricePerDay: car.pricePerDay,
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
      include: { car:{
        include:{images:true}
      }, organization: {
        include:{user: true}
      } },
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
      include: { car:{
        include:{images: true}
      }, organization:{
        include:{user:true}
      }},
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
