const http = require("http");
const fs = require("fs");
const path = require("path");

const dataStore = []; // In-memory data store

const myServer = http.createServer((req, res) => {
    const url = req.url;
    
    if (url === "/") {
        fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    } else if (url === "/api/data" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(dataStore));
    } else if (url === "/api/data" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const newItem = JSON.parse(body);
            dataStore.push(newItem);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newItem));
        });
    } else if (url === "/api/data" && req.method === "PATCH") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const { index, updatedData } = JSON.parse(body);
            dataStore[index] = updatedData;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updatedData));
        });
    } else if (url === "/api/data" && req.method === "DELETE") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });
        req.on("end", () => {
            const { index } = JSON.parse(body);
            const deletedItem = dataStore.splice(index, 1);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(deletedItem));
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

myServer.listen(8000, () => console.log("Server Started!"));
