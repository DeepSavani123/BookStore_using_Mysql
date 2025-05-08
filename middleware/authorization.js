import jwt from "jsonwebtoken";
import { messages } from "../constants/errorMessages.js";
const {authorizatioHeader,server} = messages;

const authorization = (req, res, next) => {
  let token =
    req?.cookies?.accessToken ||
    req.get("Authorization") ||
    req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: authorizatioHeader.authorizationError });
  }

  if (token.startsWith("Bearer")) {
    token = token?.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: server.internalServerError});
  }
};

export default authorization;
