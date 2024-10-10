const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req, res) => {
    const log = `${Date.now()}: ${req.url} New Req Received\n`;
    fs.appendFile('log.txt', log, (err, data) => {
        switch (req.url) {
            case '/home': res.end('HomePage');
                break
            case '/about': res.end("Its me nepali Bhai");
                break
            default:
                res.end("404");
        }
        console.log("New Req Rec.");
        console.log(req.headers);
        res.end("Hello From Server Aagain");
    });
});

myServer.listen(8000, () => console.log("Server Started!"));