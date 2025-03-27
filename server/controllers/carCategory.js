import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✅ Create a new car category
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Ensure the category name is unique
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

/**
 * ✅ Get all car categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.carCategory.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

/**
 * ✅ Get a single car category by ID
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.carCategory.findUnique({
      where: { id: Number(id) },
      include: { cars: true }, // Include related cars if needed
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

/**
 * ✅ Update a car category by ID
 */
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

/**
 * ✅ Delete a car category by ID
 */
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
