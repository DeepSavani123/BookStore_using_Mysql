import express from "express";
const router = express.Router();
import { loginUser, registerUser, logoutUser } from "../controllers/auth.js";

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

export default router;
