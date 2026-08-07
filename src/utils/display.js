export const display = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}
	return value;
};

export const date = (value, fallback = "—") => {
	if (!value) return fallback;

	const d = new Date(value);

	if (Number.isNaN(d.getTime())) {
		return fallback;
	}

	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const year = d.getFullYear();

	return `${month}-${day}-${year}`;
};

export const currency = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}
	const number = Number(value);
	return Number.isNaN(number) ? fallback : `₹${number.toLocaleString()}`;
};

export const address = (addr, fallback = "—") => {
	if (!addr) return fallback;
	const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean);
	const text = parts.join(", ");

	if (addr.pincode) {
		return text ? `${text} - ${addr.pincode}` : addr.pincode;
	}
	return text || fallback;
};

export const phone = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}

	const number = String(value).trim();

	if (!number) {
		return fallback;
	}

	if (number.startsWith("+91")) {
		return number.replace(/^\+91\s*/, "+91 ");
	}

	const cleanNumber = number.replace(/\D/g, "");

	return cleanNumber ? `+91 ${cleanNumber}` : fallback;
};

export const mask = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}

	const number = String(value).trim();

	if (!number) {
		return fallback;
	}

	if (number.length <= 4) {
		return number;
	}

	return `${"X".repeat(number.length - 4)}${number.slice(-4)}`;
};
