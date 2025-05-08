import Book from "../models/books.js";
import { messages } from "../constants/errorMessages.js";
import { Sequelize } from "sequelize";
const { book, server } = messages;

const createBook = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      author,
      pages,
      status,
      releaseYear,
    } = req.body;

    const book = await Book.create({
      userId: req.user.id,
      name,
      description,
      price,
      category,
      author,
      pages,
      status,
      releaseYear,
    });

    return res
      .status(201)
      .json({
        success: true,
        data: book,
        message: book.bookCreatedSuccessfully,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: server.internalServerError });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "DESC",
    } = req.body;

    const searchOptions = {
      userId: req.user.id,
    };

    if (search) {
      searchOptions[Sequelize.op.or] = [
        { name: { [Sequelize.Op.iLike]: `%${search}%` } },
        { author: { [Sequelize.Op.iLike]: `%${search}%` } },
      ];
    }

    const validOrder = ["ASC", "DESC"];
    const sortOrder = validOrder.includes(order.toUpperCase())
      ? order.toUpperCase()
      : "DESC";

    const offset = (page - 1) * limit;

    const { count, rows: books } = await Book.findAndCountAll({
      where: searchOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
    });

    if (!books || books.length === 0) {
      return res
        .status(200)
        .json({ success: false, data: [], message: book.booksNotFound });
    }

    return res.status(200).json({
      success: true,
      data: books,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
      message: book.booksFetchedSuccessfully,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: server.internalServerError });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: book.bookNotFound });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: book,
        message: book.bookFetchedSuccessfully,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: server.internalServerError });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({ where: { id, userId: req.user.id } });

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: bookMessages.bookNotFound });
    }

    await book.update(req.body);

    return res
      .status(200)
      .json({
        success: true,
        data: book,
        message: book.bookUpdatedSuccessfully,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: server.internalServerError });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: book.bookNotFound });
    }

    await book.destroy();

    return res
      .status(200)
      .json({ success: true, message: book.bookDeletedSuccessfully });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: server.internalServerError });
  }
};

export { createBook, getAllBooks, getBook, updateBook, deleteBook };
