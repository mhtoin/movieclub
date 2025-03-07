const { fontFamily } = require("tailwindcss/defaultTheme");

const mix = (name) =>
	`color-mix(in hsl, var(${name}), transparent calc(100% - 100% * <alpha-value>))`;
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
		},
		extend: {
			screens: {
				"2xl": "1400px",
				"4xl": "2000px",
			},
			colors: {
				border: mix("--border"),
				input: mix("--input"),
				ring: mix("--ring"),
				background: mix("--background"),
				foreground: mix("--foreground"),
				navigation: mix("--navigation"),
				popoverbg: mix("204 4% 16%"),
				primary: {
					DEFAULT: mix("--primary"),
					foreground: mix("--primary-foreground"),
				},
				secondary: {
					DEFAULT: mix("--secondary"),
					foreground: mix("--secondary-foreground"),
				},
				destructive: {
					DEFAULT: mix("--destructive"),
					foreground: mix("--destructive-foreground"),
				},
				muted: {
					DEFAULT: mix("--muted"),
					foreground: mix("--muted-foreground"),
				},
				accent: {
					DEFAULT: mix("--accent"),
					foreground: mix("--accent-foreground"),
				},
				popover: {
					DEFAULT: mix("--popover"),
					foreground: mix("--popover-foreground"),
				},
				card: {
					DEFAULT: mix("--card"),
					foreground: mix("--card-foreground"),
				},
				mobilenav: {
					DEFAULT: mix("--mobilenav"),
				},
				ringColor: {
					DEFAULT: mix("--ring"),
				},
				success: {
					DEFAULT: mix("--success"),
				},
				error: {
					DEFAULT: mix("--error"),
				},
				opaqueCard: mix("--opaque-card"),
				mainBackground: mix("--main-background"),
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ["var(--font-sans)", ...fontFamily.sans],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"slide-up": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"slide-in": {
					from: { transform: "translateY(100%)" },
					to: { transform: "translateY(0)" },
				},
				"slide-out": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(100%)" },
				},
				"button-press": {
					"0%": { transform: "scale(1)" },
					"50%": { transform: "scale(0.95)" },
					"100%": { transform: "scale(0.9)" },
				},
				"star-wave": {
					"0%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" },
					"100%": { transform: "translateY(0)" },
				},
				overlayShow: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				contentShow: {
					from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
					to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
				},
				slideUpAndFade: {
					from: { opacity: 0, transform: "translateY(2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideRightAndFade: {
					from: { opacity: 0, transform: "translateX(-2px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
				slideDownAndFade: {
					from: { opacity: 0, transform: "translateY(-2px)" },
					to: { opacity: 1, transform: "translateY(0)" },
				},
				slideLeftAndFade: {
					from: { opacity: 0, transform: "translateX(10px)" },
					to: { opacity: 1, transform: "translateX(0)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"slide-up": "slide-up 0.5s ease-out",
				"slide-in": "slide-in 0.5s ease-out",
				"slide-out": "slide-out 0.5s ease-out",
				"button-press": "button-press 0.2s ease-in",
				"star-wave": "star-wave 0.8s ease-in-out infinite",
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
				slideLeftAndFade: "slideLeftAndFade 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			dropShadow: {
				glow: [
					"0 0px 20px rgba(255,255, 255, 0.35)",
					"0 0px 65px rgba(255, 255,255, 0.1)",
				],
			},
			transitionDelay: {
				0: "0ms",
				100: "100ms",
				200: "200ms",
				300: "300ms",
				400: "400ms",
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-animate"),
		require("tailwind-gradient-mask-image"),
		require("tailwindcss-react-aria-components"),
		require("@tailwindcss/container-queries"),
		require("tailwind-easing-gradients")({
			variants: ["responsive"],
			// required
			gradients: {
				ex1: ["#050505", "#292929"], // must be two colors
				ex2: { easing: "ease-in-out", steps: 5, color: ["#050505", "#163c41"] },
				ex3: {
					easing: "cubic-bezier(0.48, 0.3, 0.64, 1)",
					color: ["#050505", "#050505"],
				},
				ex4: { easing: "steps(4, skip-none)", color: ["#4ae", "#0da"] },
			},
			// defaults
			alphaDecimals: 5,
			colorMode: "lrgb",
			type: "linear",
			easing: "ease", // default settings
			colorStops: 15,
			directions: {
				t: "to top",
				r: "to right",
				b: "to bottom",
				l: "to left",
			},
		}),
		({ addUtilities }) => {
			const newUtilities = {
				".ul-li-p-reset": {
					"& ul li p": {
						marginTop: "0",
						marginBottom: "0",
					},
				},
			};
			addUtilities(newUtilities);
		},
	],
};
