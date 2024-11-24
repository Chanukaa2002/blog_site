import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout",protectRoute, logout);

export default router;
