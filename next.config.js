const path = require("node:path");

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	experimental: {},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				port: "",
				pathname: "/t/p/**",
			},
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "/u/**",
			},
		],
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			components: path.join(__dirname, "components"),
		};
		return config;
	},
};

module.exports = nextConfig;
