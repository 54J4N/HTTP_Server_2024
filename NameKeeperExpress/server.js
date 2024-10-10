const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const dataFilePath = path.join(__dirname, "data.json");

app.use(express.json());

// Read data from file
function readData() {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

// Write data to file
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// POST - Add a new name
app.post("/api/names", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required" });
    }

    const data = readData();
    const id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    const newEntry = { name, id };
    data.push(newEntry);
    writeData(data);

    res.status(201).json(newEntry);
});

// PATCH - Update a name by ID
app.patch("/api/names/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Name is required" });
    }

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
