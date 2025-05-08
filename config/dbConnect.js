import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD
} = process.env

const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

export default sequelize;