const http = require("http");
const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data.json");

// rd data
function readData() {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

// wrt data
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.method} ${req.url}`);

    // POST
    if (req.method === "POST" && req.url === "/api/names") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const { name } = JSON.parse(body);

                if (!name) {
                    throw new Error("Name is required");
                }

                const data = readData();
                const id = data.length > 0 ? data[data.length - 1].id + 1 : 1; // generate unique ID
                const newEntry = { name, id };
                data.push(newEntry);
                writeData(data);
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify(newEntry));
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid JSON input or missing name" }));
            }
        });

    // PATCH edit a name by ID
    } else if (req.method === "PATCH" && req.url.startsWith("/api/names")) {
        const id = parseInt(req.url.split("/").pop());
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const { name } = JSON.parse(body);
                const data = readData();
                const entryIndex = data.findIndex(entry => entry.id === id);

                if (entryIndex !== -1) {
                    data[entryIndex].name = name; // Update the name
                    writeData(data);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(data[entryIndex]));
                } else {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Entry not found" }));
                }
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid JSON input or missing name" }));
            }
        });

    // DELETE to remove a name by ID
    } else if (req.method === "DELETE" && req.url.startsWith("/api/names/")) {
        const id = parseInt(req.url.split("/").pop());
        const data = readData();
        const filteredData = data.filter(entry => entry.id !== id); // Rv entry by ID

        if (data.length !== filteredData.length) {
            writeData(filteredData);
            res.writeHead(204); // No content
            res.end();
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Entry not found" }));
        }

    // GET to retrieve all names
    } else if (req.method === "GET" && req.url === "/api/names") {
        const data = readData();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));

        /*
         // GET to retrieve a name by ID
    } else if (method === "GET" && path.startsWith("/api/names/")) {
        const id = parseInt(path.split("/")[3]); // Extract the ID from the URL
        const data = readData();
        const name = data.find(item => item.id === id);

        if (name) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(name));
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Name not found" }));
        }
        */

    // Handle invalid rth
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
