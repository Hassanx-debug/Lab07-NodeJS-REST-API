
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "books.json";

app.use(express.json());

let books = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
);

function saveBooks() {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(books, null, 2),
        "utf8"
    );
}

function validBook(body) {
    return (
        body &&
        typeof body.title === "string" &&
        body.title.trim() !== "" &&
        typeof body.author === "string" &&
        body.author.trim() !== "" &&
        typeof body.price === "number" &&
        Number.isFinite(body.price) &&
        body.price >= 0
    );
}

// GET: all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// GET: one book
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(item => item.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// POST: create a book
app.post("/books", (req, res) => {
    if (!validBook(req.body)) {
        return res.status(400).json({
            message: "Valid title, author and price are required"
        });
    }

    const newId = books.length
        ? Math.max(...books.map(item => item.id)) + 1
        : 1;

    const newBook = {
        id: newId,
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        price: req.body.price
    };

    books.push(newBook);
    saveBooks();

    res.status(201).json(newBook);
});

// PUT: update a book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(item => item.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!validBook(req.body)) {
        return res.status(400).json({
            message: "Valid title, author and price are required"
        });
    }

    book.title = req.body.title.trim();
    book.author = req.body.author.trim();
    book.price = req.body.price;

    saveBooks();

    res.status(200).json(book);
});

// DELETE: remove a book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const [deletedBook] = books.splice(index, 1);

    saveBooks();

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

app.listen(PORT, () => {
    console.log(`Book API running at http://localhost:${PORT}`);
});