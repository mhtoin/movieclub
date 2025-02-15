declare global {
	interface Window {
		__theme: string;
		__onThemeChange: (theme: string) => void;
		__setPreferredTheme: (theme: string) => void;
		__accent: string;
		__onAccentChange: (accent: string) => void;
		__setPreferredAccent: (accent: string) => void;
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
	} catch (_err) {}

	window.__setPreferredTheme = (newTheme) => {
		setTheme(newTheme);
		try {
			localStorage.setItem("theme", newTheme);
		} catch (_err) {}
	};

	const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

	darkQuery.addEventListener("change", (e) => {
		window.__setPreferredTheme(e.matches ? "dark" : "light");
	});

	setTheme(preferredTheme || (darkQuery.matches ? "dark" : "light"));
};

const codeAccent = () => {
	window.__onAccentChange = () => {};

	function setAccent(newAccent: string) {
		window.__accent = newAccent;
		preferredAccent = newAccent;
		document.documentElement.dataset.accent = newAccent;
		window.__onAccentChange(newAccent);
	}

	let preferredAccent: string | null = null;

	try {
		preferredAccent = localStorage.getItem("accent");
	} catch (err) {
		console.error(err);
	}

	window.__setPreferredAccent = (newAccent) => {
		setAccent(newAccent);
		try {
			localStorage.setItem("accent", newAccent);
		} catch (err) {
			console.error(err);
		}
	};

	setAccent(preferredAccent || "");
};

export const getTheme = `(${code})();`;
export const getAccent = `(${codeAccent})();`;
