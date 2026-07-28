import fs from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getNestedValue } from "./getNestedValue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "db-final.json");

const RESERVED_PARAMS = new Set([
	"_page",
	"_limit",
	"_sort",
	"_order",
	"search",
]);

export const collectionQueryMiddleware =
	(collectionName, searchableFields = []) =>
	(req, res, next) => {
		if (req.method !== "GET" || req.path !== `/${collectionName}`) {
			return next();
		}

		const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
		let items = db[collectionName];

		if (!Array.isArray(items)) {
			return res
				.status(404)
				.json({ message: `Collection '${collectionName}' not found.` });
		}

		// GLOBAL SEARCH
		if (req.query.search) {
			const term = req.query.search.toLowerCase();
			items = items.filter((it) =>
				searchableFields.some((field) => {
					const value = getNestedValue(it, field);

					return (
						value && value.toString().toLowerCase().includes(term)
					);
				}),
			);
		}

		// EMPLOYEE BY DEPARTMENT
		for (const [key, value] of Object.entries(req.query)) {
			if (RESERVED_PARAMS.has(key)) continue;

			items = items.filter((item) => {
				const fieldValue = getNestedValue(item, key);

				if (fieldValue == null) return false;

				return (
					fieldValue.toString().toLowerCase() ===
					value.toString().toLowerCase()
				);
			});
		}

		// SORTING
		const sort = req.query._sort || "employeeId";
		const order = req.query._order || "desc";

		items = [...items].sort((a, b) => {
			const first = getNestedValue(a, sort);
			const second = getNestedValue(b, sort);

			if (first == null && second == null) return 0;
			if (first == null) return 1;
			if (second == null) return -1;

			if (first < second) return order === "asc" ? -1 : 1;
			if (first > second) return order === "asc" ? 1 : -1;

			return 0;
		});

		// PAGINATION
		if (req.query._page) {
			const page = Number(req.query._page) || 1;
			const limit = Number(req.query._limit) || 10;

			const total = items.length;

			const start = (page - 1) * limit;
			const end = start + limit;

			res.setHeader("X-Total-Count", total);

			return res.jsonp(items.slice(start, end));
		}
		return res.jsonp(items);
	};
