// to start a server 
import { readFile, writeFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import crypto from "crypto"

const PORT = 3002;

const serveFile = async (res, filePath, contentType) => {
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 page not found");
    }
};


// create http server
const server = createServer(async (req, res) => {
    console.log(req.url); // this is giving every req

    if (req.method === "GET") {
        if (req.url === "/" || req.url.startsWith("/?")) {
            return serveFile(
                res,
                path.join("public", "index.html"),
                "text/html"
            );
        } 
        if (req.url === "/style.css") {
            return serveFile(
                res,
                path.join("public", "style.css"),
                "text/css"
            );
        }

        // Handle short URL redirects
        const shortCode = req.url.slice(1);
        if (shortCode) {
            try {
                const data = await readFile(path.join("data", "link.json"), "utf8");
                const links = JSON.parse(data);
                const originalUrl = links[shortCode];
                if (originalUrl) {
                    res.writeHead(302, { Location: originalUrl });
                    return res.end();
                }
            } catch (e) {
                // Ignore errors, fall through to 404
            }
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
    
    // handel when Shorten is clicked
    if (req.method === "POST" && req.url === "/shorten") {
        let body = "";
        req.on("data", (chunk) => {
            body = body + chunk;
        });

        req.on("end", async () => {
            console.log(body);
            const { url, shortCode } = JSON.parse(body);

            //  if url is not there
            if (!url) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "URL is required" }));
            }

            // to read the data which is inside link.json
            let links = {};
            try {
                const data = await readFile(path.join("data", "link.json"), "utf8");
                links = JSON.parse(data);
            } catch (e) {
                // File doesn't exist or is empty, use empty object
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


