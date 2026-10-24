import { Router } from "express";
import {
  getMatakuliah,
  tambahMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
  getIPK,
} from "../controllers/matakuliahController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getMatakuliah);
router.post("/", tambahMatakuliah);
router.put("/:id", updateMatakuliah);
router.delete("/:id", deleteMatakuliah);
router.get("/ipk", getIPK);

export default router;