import express from "express";
import {  createUser, loginUser, getAllUsers } from "../controllers/users.js";

const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);

export default router;
