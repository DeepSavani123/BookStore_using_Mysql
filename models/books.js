import { DataTypes } from "sequelize";
import sequelize from "../config/dbConnect.js";

const bookSchema = sequelize.define(
  "Books",
  {
    userId: {
      type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    releaseYear: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "books",
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

export default bookSchema;
