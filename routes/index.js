import express from "express";
const router = express.Router();
import authorization from "../middleware/authorization.js";
import auth from "./auth.js";
import books from "./books.js";

router.use("/auth", auth);
router.use("/books", authorization, books);

export default router;
