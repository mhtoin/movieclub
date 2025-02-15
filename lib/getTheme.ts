declare global {
	interface Window {
		__theme: string;
		__onThemeChange: (theme: string) => void;
		__setPreferredTheme: (theme: string) => void;
	}
}

const code = () => {
	window.__onThemeChange = () => {};

	function setTheme(newTheme: string) {
		document.documentElement.classList.remove(window.__theme);
		window.__theme = newTheme;
		preferredTheme = newTheme;
		document.documentElement.dataset.theme = newTheme;
		document.documentElement.classList.add(newTheme);
		window.__onThemeChange(newTheme);
	}

	let preferredTheme: string | null = null;

	try {
		preferredTheme = localStorage.getItem("theme");
	} catch (err) {}

	window.__setPreferredTheme = (newTheme) => {
		setTheme(newTheme);
		try {
			localStorage.setItem("theme", newTheme);
		} catch (err) {}
	};

	const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

	darkQuery.addEventListener("change", (e) => {
		window.__setPreferredTheme(e.matches ? "dark" : "light");
	});

	setTheme(preferredTheme || (darkQuery.matches ? "dark" : "light"));
};

export const getTheme = `(${code})();`;
