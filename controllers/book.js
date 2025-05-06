import  Book  from '../models/books.js'; 
import { responseMessages } from '../constants/errorMessages.js';
const {bookMessages, serverMessages} = responseMessages

const createBook = async (req, res) => {
    try {
        const { name, description, price, category, author, pages, status, releaseYear } = req.body;

        const book = await Book.create({
            userId: req.user.id, 
            name,
            description,
            price,
            category,
            author,
            pages,
            status,
            releaseYear
        });

        return res.status(201).json({ success: true, data: book, message: bookMessages.bookCreatedSuccessfully});
    } catch (error) {
        return res.status(400).json({ success: false, message: serverMessages.unKnownError});
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({ where: { userId: req.user.id } });

        if(!books) {
            return res.status(404).json({ success: false, message: bookMessages.booksNotFound})
        }

        return res.status(200).json({ success: true, data: books, message: bookMessages.booksFetchedSuccessfully });
    } catch (error) {
        return res.status(400).json({ success: false, message: serverMessages.unKnownError });
    }
};

const getBook = async (req, res) => {
    try {
        const book = await Book.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            }
        });

        if (!book) {
            return res.status(404).json({ success: false, message: bookMessages.bookNotFound });
        }

        return res.status(200).json({ success: true, data: book , message: bookMessages.bookFetchedSuccessfully});
    } catch (error) {
        return res.status(400).json({ success: false, message: serverMessages.unKnownError});
    }
};


const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findOne({ where: { id, userId: req.user.id } });

        if (!book) {
            return res.status(404).json({ success: false, message: bookMessages.bookNotFound });
        }

        await book.update(req.body);

        return res.status(200).json({ success: true, data: book, message: bookMessages.bookUpdatedSuccessfully });
    } catch (error) {
        return res.status(400).json({ success: false, message: serverMessages.unKnownError });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ where: { id: req.params.id, userId: req.user.id } });

        if (!book) {
            return res.status(404).json({ success: false, message: bookMessages.bookNotFound });
        }

        await book.destroy();

        return res.status(200).json({ success: true, message: bookMessages.bookDeletedSuccessfully });
    } catch (error) {
        return res.status(400).json({ success: false, message: serverMessages.unKnownError});
    }
};

export { createBook, getAllBooks, getBook, updateBook, deleteBook };