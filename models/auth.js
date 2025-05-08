import sequelize from "../config/dbConnect.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";

const userSchema = sequelize.define(
  "auth",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false,
    },
    interest: {
      type: DataTypes.JSON, 
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    tableName: "auths",
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10); // direct salt rounds
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }

);

(async () => {
  try {
    await sequelize.sync();
    console.log("Table created successfully!");
  } catch (error) {
    console.error("Unable to create table", error);
  }
})();

export default userSchema;
