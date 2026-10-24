import { Router } from "express";
import { getProfil, updateProfil } from "../controllers/profilController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getProfil);
router.put("/", updateProfil);

export default router;