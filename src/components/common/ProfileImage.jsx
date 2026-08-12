import { memo, useMemo, useState } from "react";
import PropTypes from "prop-types";

const COLORS = ["2563eb", "059669", "7c3aed", "c2410c", "be123c", "0f766e"];

const createAvatar = (name = "Employee") => {
	const initials = name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("") || "E";
	const colorIndex = [...name].reduce((total, character) => total + character.charCodeAt(0), 0) % COLORS.length;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="#${COLORS[colorIndex]}"/><text x="64" y="69" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-size="48" font-weight="700">${initials}</text></svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const ProfileImage = ({ src, name, className = "", eager = false }) => {
	const fallback = useMemo(() => createAvatar(name), [name]);
	const initialSource = src?.startsWith("https://ui-avatars.com/") ? fallback : src || fallback;
	const [source, setSource] = useState(initialSource);

	return (
		<img
			src={source}
			alt={name}
			width="128"
			height="128"
			loading={eager ? "eager" : "lazy"}
			fetchPriority={eager ? "high" : "auto"}
			decoding="async"
			onError={() => setSource(fallback)}
			className={className}
		/>
	);
};

ProfileImage.propTypes = {
	src: PropTypes.string,
	name: PropTypes.string.isRequired,
	className: PropTypes.string,
	eager: PropTypes.bool,
};

export default memo(ProfileImage);
