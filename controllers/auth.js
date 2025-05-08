import auth from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { messages } from "../constants/errorMessages.js";
const {user, server} = messages;

const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, interest } = req.body;


    const existingUser = await auth.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: user.emailAlreadyExists});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await auth.create({
      name,
      email,
      password: hashedPassword,
      gender,
      interest,
      image: req.file?.filename || null,
    });

    return res
      .status(201)
      .json({ success: true, message: user.userRegistered });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: server.internalServerError});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await auth.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: user.invalidCredentials });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: user.invalidCredentials });
    }


    const { password: _, ...safeData } = user.get({ plain: true });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("accessToken", token, {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "strict",
      })
      .json({ success: true, message: user.loginSuccessfully });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, data:safeData, message: server.internalServerError});
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res
      .status(200)
      .json({ success: true, message: user.logoutSuccessfully });
  } catch (error) {
    return res.status(500).json({ success: false, message: server.internalServerError});
  }
};

export { 
  registerUser, 
  loginUser, 
  logoutUser 
};
