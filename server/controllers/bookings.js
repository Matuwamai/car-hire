import prisma from "../prismaClient.js";


export const createBooking = async (req, res) => {
  try {
    const { carId, organizationId, periodId, totalPrice } = req.body;

    // Ensure the car is not already booked
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.isHired) return res.status(400).json({ message: "Car is already booked" });

    const booking = await prisma.booking.create({
      data: {
        carId,
        organizationId,
        periodId,
        totalPrice,
      },
    });

    // Update the car status to "hired"
    await prisma.car.update({
      where: { id: carId },
      data: { isHired: true },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    // Find the booking first
    const booking = await prisma.booking.findUnique({ where: { id: parseInt(id) } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Update car status before deleting
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
