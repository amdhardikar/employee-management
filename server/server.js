import jsonServer from "json-server";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { collectionQueryMiddleware } from "./collectionQueryMiddleware.js";
import { dashboardMiddleware } from "./dashboardMiddleware.js";


const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db-final.json"));
const middlewares = jsonServer.defaults();

server.use(
	cors({
		exposedHeaders: ["X-Total-Count"],
	}),
);

server.use(middlewares);

// Our middleware
server.use(
	collectionQueryMiddleware("employees", [
		"employeeId",
		"employeeCode",
		"personalInfo.firstName",
		"personalInfo.lastName",
		"personalInfo.email",
	]),
);

server.use(
	collectionQueryMiddleware("attendance", [
		"employeeId",
		"employeeCode",
		"personalInfo.firstName",
		"personalInfo.lastName",
	]),
);


server.use(dashboardMiddleware);

// json-server routes
server.use(router);

server.listen(5000, () => {
	console.log("JSON Server running on port 5000");
});
