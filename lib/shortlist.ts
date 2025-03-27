"server only";
import { createDbMovie } from "@/lib/createDbMovie";
import type { MovieWithUser } from "@/types/movie.type";
import type { TMDBMovieResponse } from "@/types/tmdb.type";
import type { Movie } from "@prisma/client";
import { isWednesday, nextWednesday, set } from "date-fns";
import { NextResponse } from "next/server";
import { db } from "./db";
import prisma from "./prisma";
import { getAdditionalInfo } from "./tmdb";
import { keyBy } from "./utils";

export const revalidate = 10;

export async function getChosenMovie() {
	// set today to 18:00:00 and check if it is a wednesday
	const nextMovieDate = set(nextWednesday(new Date()), {
		hours: 18,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	const now = isWednesday(new Date())
		? set(new Date(), { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
		: nextMovieDate;

	const movie = await prisma.movie.findFirst({
		where: {
			OR: [
				{
					movieOfTheWeek: {
						equals: now,
					},
				},
				{
					movieOfTheWeek: {
						equals: nextMovieDate,
					},
				},
			],
		},
		include: {
			user: true,
		},
	});

	const details = movie ? await getAdditionalInfo(movie?.tmdbId) : {};
	if (movie) {
		const movieObject = Object.assign(movie, details);

		return movieObject;
	}
}

export async function getShortList(id: string) {
	const shortlist = await prisma.shortlist.findFirst({
		where: {
			id: id,
		},
		include: {
			movies: {
				include: {
					user: true,
				},
			},
			user: true,
		},
	});

	return shortlist;
}

export async function getAllShortLists() {
	return await db.shortlist.findMany({
		include: {
			movies: true,
			user: true,
		},
	});
}

export const getAllShortlistsGroupedById = async () => {
	const data = await getAllShortLists();
	const groupedData = keyBy(data, (shortlist) => shortlist.id);
	return groupedData;
};

export async function findOrCreateShortList(userId: string) {
	const shortlist = await prisma.shortlist.upsert({
		where: {
			userId: userId,
		},
		update: {},
		create: {
			userId: userId,
		},
	});

	return shortlist;
}

export async function connectMovieToShortlist(
	movieId: string,
	shortlistId: string,
) {
	const shortlist = await prisma.shortlist.findUnique({
		where: {
			id: shortlistId,
		},
		include: {
			movies: true,
		},
	});

	if (shortlist?.movies.length && shortlist.movies.length >= 3) {
		throw new Error("Only 3 movies allowed, remove to make room");
	}

	const updatedShortlist = await prisma.shortlist.update({
		where: {
			id: shortlistId,
		},
		data: {
			movies: { connect: { id: movieId } },
		},
		include: {
			movies: {
				include: {
					user: true,
				},
			},
			user: true,
		},
	});

	return updatedShortlist;
}

export async function addMovieToShortlist(
	movie: TMDBMovieResponse,
	shortlistId: string,
) {
	// check if user has shortlist, create if absent
	const shortlist = await prisma.shortlist.findFirst({
		where: {
			id: shortlistId,
		},
		include: {
			movies: true,
		},
	});

	if (shortlist && shortlist.movies.length === 3) {
		throw new Error("Only 3 movies allowed, remove to make room");
	}

	const movieObject = await createDbMovie(movie);

	const updatedShortlist = await prisma.shortlist.update({
		where: {
			id: shortlistId,
		},
		data: {
			movies: {
				connectOrCreate: {
					where: {
						tmdbId: movieObject.tmdbId,
					},
					create: movieObject,
				},
			},
		},
		include: {
			movies: {
				include: {
					user: true,
				},
			},
		},
	});

	return updatedShortlist;
}

export async function removeMovieFromShortlist(
	id: string,
	shortlistId: string,
) {
	try {
		const updatedShortlist = await prisma.shortlist.update({
			where: {
				id: shortlistId,
			},
			data: {
				movies: {
					disconnect: [{ id: id }],
				},
			},
			include: {
				movies: true,
			},
		});

		return updatedShortlist;
		//return NextResponse.json({ message: "Deleted succesfully" });
	} catch (_e) {
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
}

export async function updateChosenMovie(movie: Movie) {
	/**
	 * First update the last week's movie to false
	 */
	const nextDate = set(nextWednesday(new Date()), {
		hours: 18,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	const updatedMovie = await prisma.movie.update({
		where: {
			id: movie.id,
		},
		data: {
			movieOfTheWeek: nextDate,
		},
	});

	return updatedMovie;
}

export async function updateShortlistState(
	ready: boolean,
	shortlistId: string,
) {
	const updated = await prisma.shortlist.update({
		where: {
			id: shortlistId,
		},
		data: {
			isReady: ready,
		},
	});

	return updated;
}

export async function updateShortlistParticipationState(
	participating: boolean,
	shortlistId: string,
) {
	return await prisma.shortlist.update({
		where: {
			id: shortlistId,
		},
		data: {
			participating: participating,
		},
	});
}

export async function updateShortlistSelection(
	index: number,
	shortlistId: string,
) {
	const updated = await prisma.shortlist.update({
		where: {
			id: shortlistId,
		},
		data: {
			selectedIndex: index,
		},
	});

	return updated;
}

export async function updateShortlistSelectionStatus(
	status: boolean,
	shortlistId: string,
) {
	const updated = await prisma.shortlist.update({
		where: {
			id: shortlistId,
		},
		data: {
			requiresSelection: status,
			selectedIndex: null,
		},
	});

	return updated;
}

export async function replaceShortlistMovie(
	replacedMovie: MovieWithUser | Movie,
	replacingWithMovie: MovieWithUser | TMDBMovieResponse | Movie,
	shortlistId: string,
) {
	// try to fetch the movie from the db to check if it exists
	// if tmdbId is present, it means replacingWithMovie is of type Movie
	// so we can just insert it directly
	if ("tmdbId" in replacingWithMovie) {
		const updated = await prisma.shortlist.update({
			where: {
				id: shortlistId,
			},
			data: {
				movies: {
					disconnect: [{ id: replacedMovie.id }],
					connect: {
						tmdbId: replacingWithMovie.tmdbId,
					},
				},
			},
			include: {
				movies: {
					include: {
						user: true,
					},
				},
			},
		});

		return updated;
	}
	const movieObject = await createDbMovie(replacingWithMovie);

	const updatedShortlist = await prisma.shortlist.update({
		where: {
			id: shortlistId,
		},
		data: {
			movies: {
				disconnect: [{ id: replacedMovie.id }],
				connectOrCreate: {
					where: {
						tmdbId: movieObject.tmdbId,
					},
					create: movieObject,
				},
			},
		},
		include: {
			movies: {
				include: {
					user: true,
				},
			},
		},
	});

	return updatedShortlist;
}
