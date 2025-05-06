import express from "express";
const router = express.Router();
import {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} from "../controllers/book.js";

router.post("/create", createBook);
router.get("/get", getAllBooks);
router.get("/get/:id", getBook);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", deleteBook);

export default router;
