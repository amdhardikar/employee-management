const metrics = [];

const recordMetric = (metric) => {
	const entry = {
		name: metric.name,
		value: metric.value,
		rating: metric.rating,
		delta: metric.delta,
		id: metric.id,
		navigationType: metric.navigationType,
	};

	metrics.push(entry);
	window.__EMS_WEB_VITALS__ = [...metrics];

	if (import.meta.env.DEV) {
		console.info("[Web Vitals]", entry);
	}
};

export const reportWebVitals = async () => {
	if (typeof window === "undefined") return;

	const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import("web-vitals");
	[onCLS, onFCP, onINP, onLCP, onTTFB].forEach((subscribe) => subscribe(recordMetric));
};

export default reportWebVitals;
