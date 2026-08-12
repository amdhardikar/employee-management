import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import process from "node:process";

const port = Number(process.argv[2] || 4174);
const distDirectory = join(process.cwd(), "dist");
const contentTypes = {
	".css": "text/css; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".ico": "image/x-icon",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml",
};

const server = createServer((request, response) => {
	const requestedPath = normalize(decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname));
	const assetPath = join(distDirectory, requestedPath);
	const isFile = existsSync(assetPath) && statSync(assetPath).isFile();
	const filePath = isFile ? assetPath : join(distDirectory, "index.html");

	response.setHeader("Content-Type", contentTypes[extname(filePath)] || "application/octet-stream");
	createReadStream(filePath).pipe(response);
});

server.listen(port, "127.0.0.1");

const close = () => server.close(() => process.exit(0));
process.on("SIGINT", close);
process.on("SIGTERM", close);
