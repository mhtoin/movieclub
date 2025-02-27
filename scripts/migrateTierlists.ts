// migration-script.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateTierlists() {
	// 1. Get all existing tierlists
	let existingTierlists = await prisma.tierlists.findMany({
		include: {
			tierlistTiers: {
				include: {
					movies: true,
				},
			},
		},
	});

	existingTierlists = existingTierlists.filter(
		(tierlist) => tierlist.userId === "6508739865db145325247550",
	);

	console.log("existingTierlists", existingTierlists);

	const watchedMovies = await prisma.movie.findMany({
		where: {
			watchDate: {
				not: null,
			},
		},
	});

	const watchedMoviesIds = watchedMovies.map((movie) => movie.id);

	for (const tierlist of existingTierlists) {
		//console.dir(tierlist, { depth: null });
		const tierIds = [];
		const moviesInTiers = tierlist.tiers.flatMap((tier) => tier.movies);
		const unrankedMovies = watchedMoviesIds.filter(
			(movie) => !moviesInTiers.includes(movie),
		);

		console.log("unrankedMovies", unrankedMovies);

		/*
		const unrankedTier = await prisma.tier.create({
			data: {
				label: "Unranked",
				value: 0,
				tierlist: {
					connect: { id: tierlist.id },
				},
				movies: {
					connect: unrankedMovies.map((movie) => ({ id: movie })),
				},
			},
		});
		tierIds.push(unrankedTier.id);*/

		for (const tier of tierlist.tiers) {
			console.dir(tier, { depth: null });
			const tierMovies = tier.movies.map((movie) => movie);
			console.log("tier", tier.label);
			console.log("tierMovies", tierMovies);
			console.log("tier.movies", tier.movies);

			// create new tier
			const newTier = await prisma.tier.create({
				data: {
					label: tier.label,
					value: tier.value,
					tierlist: {
						connect: { id: tierlist.id },
					},
					tierMovies: {
						create: tierMovies.map((movie, index) => ({
							movie: {
								connect: { id: movie },
							},
							position: index,
						})),
					},
				},
			});

			// connect movies to the tier one by one to ensure order

			tierIds.push(newTier.id);
		}
	}
	/*
	for (const tierlist of existingTierlists) {
		// 2. For each tierlist, create new Tier records
		// Assuming your old structure had tiers as an object/array directly in Tierlists
		if (tierlist.tiers) {
			// Create new Tier records
			await Promise.all(
				Object.entries(tierlist.tiers).map(([label, value]) => {
					return prisma.tier.create({
						data: {
							label,
							value: typeof value === "number" ? value : Number.parseInt(value),
							movieIds: [], // Initialize with empty array or existing movie IDs if you had them
							tierlistId: tierlist.id,
						},
					});
				}),
			);
		}
	}*/
}

async function main() {
	try {
		await migrateTierlists();
		console.log("Migration completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
