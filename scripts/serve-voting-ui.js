const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const WEB_ROOT = path.resolve(__dirname, "../web/voting");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function send(response, statusCode, contentType, data) {
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(data);
}

function resolveRequestedPath(urlPath) {
  const cleanPath = decodeURIComponent((urlPath || "/").split("?")[0]);
  const relativePath = cleanPath === "/" ? "/index.html" : cleanPath;
  const targetPath = path.normalize(path.join(WEB_ROOT, relativePath));

  if (!targetPath.startsWith(WEB_ROOT)) {
    return null;
  }

  return targetPath;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequestedPath(request.url);
  if (!filePath) {
    send(response, 400, "text/plain; charset=utf-8", "Bad request");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        send(response, 404, "text/plain; charset=utf-8", "Not found");
        return;
      }
      send(response, 500, "text/plain; charset=utf-8", "Server error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] || "application/octet-stream";
    send(response, 200, contentType, data);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Voting UI running at http://127.0.0.1:${PORT}`);
});
