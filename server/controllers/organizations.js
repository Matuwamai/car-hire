import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        user: { 
          select: { 
            id: true, 
            name: true , // Alias to avoid conflict
            email: true, 
            profileImage: true, 
            createdAt: true, 
            role: true 
          } 
        },
      },
    });
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ error: "Error fetching organizations" });
  }
};


export const getOrganizationById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        user: { 
          select: { 
            id: true, 
            name: true , // Alias to avoid conflict
            email: true, 
            profileImage: true, 
            createdAt: true, 
            role: true 
          } 
        },
        bookings:{
          select:{
            id : true,
            createdAt: true,
            startDate:true,
            endDate:true,
            totalPrice:true
          }
        }
      },
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    res.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ error: "Error fetching organization" });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); 
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const updatedOrganization = await prisma.organization.update({
      where: { id },
      data: req.body,
    });
    res.json({ message: "Organization updated successfully", updatedOrganization });
  } catch (error) {
    res.status(500).json({ error: "Error updating organization" });
  }
};
export const deleteOrganization = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    await prisma.organization.delete({ where: { id } });
    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting organization" });
  }
};
export const verifyOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    const organization = await prisma.organization.findUnique({
      where: { id: Number(id) },
    });

    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    await prisma.organization.update({
      where: { id: Number(id) },
      data: { isVerified: true },
    });

    return res.status(200).json({ message: "Organization verified successfully" });
  } catch (error) {
    console.error("Error verifying organization:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

