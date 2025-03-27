import prisma from "../prismaClient.js";


export const createPeriod = async (req, res) => {
  try {
    const { name, durationInDays, priceMultiplier } = req.body;

    const period = await prisma.period.create({
      data: { name, durationInDays, priceMultiplier },
    });

    res.status(201).json(period);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllPeriods = async (req, res) => {
  try {
    const periods = await prisma.period.findMany();
    res.status(200).json(periods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getPeriodById = async (req, res) => {
  try {
    const { id } = req.params;

    const period = await prisma.period.findUnique({
      where: { id: parseInt(id) },
    });

    if (!period) return res.status(404).json({ message: "Period not found" });

    res.status(200).json(period);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updatePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, durationInDays, priceMultiplier } = req.body;

    const period = await prisma.period.update({
      where: { id: parseInt(id) },
      data: { name, durationInDays, priceMultiplier },
    });

    res.status(200).json(period);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePeriod = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.period.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Period deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
