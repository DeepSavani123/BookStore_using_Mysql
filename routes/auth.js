import express from "express";
const router = express.Router();
import { loginUser, registerUser, logoutUser } from "../controllers/auth.js";
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, './public/userImages')
   },

   filename: function(res,file,cb) {
      cb(null,`${Date.now()}${path.extname(file.originalname)}`)
   }
})

const upload = multer({storage: storage})
router.post("/login", loginUser);
router.post("/register", upload.single('image'), registerUser);
router.get("/logout", logoutUser);

export default router;
