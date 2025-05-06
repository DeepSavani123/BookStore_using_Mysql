import jwt from "jsonwebtoken";

const authorization = (req, res, next) => {
  let token =
    req?.cookies?.accessToken ||
    req.get("Authorization") ||
    req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token is required!" });
  }

  if (token.startsWith("Bearer")) {
    token = token?.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token!" });
  }
};

export default authorization;
