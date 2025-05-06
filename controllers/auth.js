import User from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { responseMessages } from "../constants/errorMessages.js";

const {userMessages, serverMessages} = responseMessages

const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender, interest } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: userMessages.emailAlreadyExists});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      interest,
      image: req.file?.filename || null,
    });

    return res
      .status(201)
      .json({ success: true, message: userMessages.userRegistered });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: serverMessages.internalServerError});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: userMessages.invalidCredentials });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: userMessages.invalidCredentials });
    }

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
      .json({ success: true, message: userMessages.loginSuccessfully });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: serverMessages.internalServerError});
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res
      .status(200)
      .json({ success: true, message: userMessages.logoutSuccessfully });
  } catch (error) {
    return res.status(500).json({ success: false, message: serverMessages.internalServerError});
  }
};

export { registerUser, loginUser, logoutUser };
