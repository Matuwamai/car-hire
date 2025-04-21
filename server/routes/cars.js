import express from 'express';
import multer from 'multer';
import {
  createCar,
  getAllCars,
  getCarById,
  getCarsByOwner,
  verifyCar,
  updateCar,
  deleteCar
} from "../controllers/cars.js"
import {  authenticate, authorizeRoles } from "../middlewares/auth.js";
const router = express.Router();
const upload = multer({ dest: 'uploads/cars' }); 

router.post('/', authenticate,authorizeRoles(["CAR_OWNER"]), upload.array('images'), createCar);
router.get('/', authenticate, getAllCars);
router.get('/:id', authenticate, getCarById);
router.get('/owner/:userId', authenticate, getCarsByOwner);
router.patch('/verify/:id',authenticate, authorizeRoles(["ADMIN"]), verifyCar);
router.put('/:id',  authenticate, authorizeRoles(["CAR_OWNER", "ADMIN"]), upload.array('images'), updateCar);
router.delete('/:id', authenticate, authorizeRoles(["CAR_OWNER", "ADMIN"]), deleteCar);

export default router;
