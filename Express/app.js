const express = require("express");
const { readData, writeData } = require("./helpers/dataHelper");
const validateName = require("./middleware/validateName");

const app = express();
const PORT = 3000;

app.use(express.json());

// POST - Add a new name
app.post("/api/names", validateName, (req, res) => {
    const { name } = req.body;
    const data = readData();
    const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    const newEntry = { name, id };
    data.push(newEntry);
    writeData(data);
    res.status(201).json(newEntry);
});

// PATCH - Update a name by ID
app.patch("/api/names/:id", validateName, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const data = readData();
    const entryIndex = data.findIndex(entry => entry.id === parseInt(id));

    if (entryIndex !== -1) {
        data[entryIndex].name = name;
        writeData(data);
        res.json(data[entryIndex]);
    } else {
        res.status(404).json({ success: false, message: "Entry not found" });
    }
});

// DELETE - Remove a name by ID
app.delete("/api/names/:id", (req, res) => {
    const { id } = req.params;
    const data = readData();
    const filteredData = data.filter(entry => entry.id !== parseInt(id));

    if (data.length !== filteredData.length) {
        writeData(filteredData);
        res.status(204).end();
    } else {
        res.status(404).json({ success: false, message: "Entry not found" });
    }
});

// GET - Retrieve all names or search by name
app.get("/api/names", (req, res) => {
    const { name } = req.query; // Get query parameter
    const data = readData();

    if (name) {
        const filteredData = data.filter(entry => entry.name.toLowerCase().includes(name.toLowerCase()));
        return res.json(filteredData);
    }

    res.json(data);
});

// GET - Retrieve a name by ID
app.get("/api/names/:id", (req, res) => {
    const { id } = req.params;
    const data = readData();
    const entry = data.find(item => item.id === parseInt(id));

    if (entry) {
        res.json(entry);
    } else {
        res.status(404).json({ success: false, message: "Name not found" });
    }
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
