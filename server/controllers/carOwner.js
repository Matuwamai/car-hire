import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCarOwners = async (req, res) => {
  const { search = "", page = 1, limit = 10 } = req.query;

  const currentPage = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (currentPage - 1) * pageSize;

  try {
    const [carOwners, totalCarOwners] = await Promise.all([
      prisma.carOwner.findMany({
        where: {
          OR: [
            { user: { name: { contains: search} } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
              createdAt: true,
              role: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      prisma.carOwner.count({
        where: {
          OR: [
            { user: { name: { contains: search} } },
            
          ],
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCarOwners / pageSize);

    res.status(200).json({
      carOwners,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error("Error fetching car owners:", error);
    res.status(500).json({ error: "Error fetching car owners" });
  }
};


export const getCarOwnerById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const carOwner = await prisma.carOwner.findUnique({
      where: { id },
      include: {
        user: true,
        cars: {
          include: { images: true }
        }

      }
    });
    if (!carOwner) return res.status(404).json({ error: "Car owner not found" });
    res.status(200).json(carOwner);
  } catch (error) {
    res.status(500).json({ error: "Error fetching car owner" });
  }
};
export const updateCarOwner = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const updatedCarOwner = await prisma.carOwner.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ message: "Car owner updated successfully", updatedCarOwner });
  } catch (error) {
    res.status(500).json({ error: "Error updating car owner" });
  }
};
export const deleteCarOwner = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await prisma.carOwner.delete({ where: { id } });
    res.status(200).json({ message: "Car owner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting car owner" });
  }
};
