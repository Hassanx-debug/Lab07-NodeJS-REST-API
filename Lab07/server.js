
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "students.json";

app.use(express.json());

let students = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
);

function saveStudents() {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(students, null, 2),
        "utf8"
    );
}

// GET: all students
app.get("/students", (req, res) => {
    res.status(200).json(students);
});

// GET: students by department
app.get("/students/department/:department", (req, res) => {
    const department = req.params.department.toLowerCase();

    const result = students.filter(
        item => item.department.toLowerCase() === department
    );

    res.status(200).json(result);
});

// GET: one student
app.get("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(
        item => item.id === id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// POST: add a student
app.post("/students", (req, res) => {
    const { name, department } = req.body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof department !== "string" ||
        !department.trim()
    ) {
        return res.status(400).json({
            message: "name and department are required"
        });
    }

    const newId = students.length
        ? Math.max(...students.map(item => item.id)) + 1
        : 1;

    const newStudent = {
        id: newId,
        name: name.trim(),
        department: department.trim()
    };

    students.push(newStudent);
    saveStudents();

    res.status(201).json(newStudent);
});

// PUT: update a student
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(
        item => item.id === id
    );

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, department } = req.body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof department !== "string" ||
        !department.trim()
    ) {
        return res.status(400).json({
            message: "name and department are required"
        });
    }

    student.name = name.trim();
    student.department = department.trim();

    saveStudents();

    res.status(200).json(student);
});

// DELETE: remove a student
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(
        item => item.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const [deletedStudent] = students.splice(index, 1);

    saveStudents();

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});