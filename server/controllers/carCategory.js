import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingCategory = await prisma.carCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await prisma.carCategory.create({
      data: { name, description },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating category" });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.carCategory.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.carCategory.findUnique({
      where: { id: Number(id) },
      include: {
        cars: {
          select :{
            images: true,
            brand:true,
            model:true,
            isHired:true,
            pricePerDay:true,
            ownerName:true,
            createdAt:true
            
          }

        }
      }, 
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching category" });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await prisma.carCategory.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating category" });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.carCategory.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting category" });
  }
};
