import dotenv from "dotenv";
dotenv.config();

import sequelize from "./config/dbConnect.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    app.use("/api", router);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

startServer();
