import prisma from "../lib/prisma";

async function main() {
	const movies = await prisma.movie.findMany();

	for (const movie of movies) {
		const imdbId = movie.imdbId;
		if (!imdbId) {
			const response = await fetch(
				`https://api.themoviedb.org/3/movie/${movie.tmdbId}/external_ids`,
				{
					method: "GET",
					headers: {
						accept: "application/json",
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
					},
				},
			);
			const data = await response.json();
			const fetchedImdbId = data.imdb_id;
			console.log(fetchedImdbId);

			if (fetchedImdbId) {
				await prisma.movie.update({
					where: { id: movie.id },
					data: { imdbId: fetchedImdbId },
				});
			}
		}
	}
}

main();
