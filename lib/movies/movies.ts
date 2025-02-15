"use server";
import type { Movie, MovieOfTheWeek } from "@/types/movie.type";
import { MoviesOfTheWeekByMonth } from "@/types/query.type";
import type { User } from "@prisma/client";
import {
	endOfDay,
	format,
	formatISO,
	isWednesday,
	nextWednesday,
	set,
	startOfDay,
} from "date-fns";
import prisma from "../prisma";
import {
	getAllShortLists,
	removeMovieFromShortlist,
	updateShortlistSelectionStatus,
	updateShortlistState,
} from "../shortlist";
import { getAdditionalInfo } from "../tmdb";
import {
	countByKey,
	groupBy,
	keyBy,
	sample,
	sendNotification,
	shuffle,
	sortByISODate,
} from "../utils";

type ChosenMovie = {
	user: User;
	shortlistId: string;
	movie: Movie;
};

export async function getMostRecentMovieOfTheWeek() {
	const movies = await prisma.movie.findMany({
		where: {
			watchDate: {
				not: null,
			},
		},
		orderBy: {
			watchDate: "desc",
		},
		include: {
			user: true,
		},
		take: 1,
	});

	return movies[0] as unknown as MovieOfTheWeek;
}

export async function getMoviesOfOfTheWeekByMonthGrouped() {
	const movies = await prisma.movie.findMany({
		where: {
			watchDate: {
				not: null,
			},
		},
		orderBy: {
			watchDate: "desc",
		},
		include: {
			user: true,
			reviews: true,
			ratings: true,
		},
	});

	const grouped = groupBy(movies.slice(1), (movie) =>
		movie.watchDate?.split("-").splice(0, 2).join("-"),
	);

	return grouped;
}

export async function getMoviesOfTheWeekByMonth(month: string) {
	const currentMonth = format(new Date(), "yyyy-MM");
	const targetMonth = month || currentMonth;
	const movies = await prisma.movie.findMany({
		where: {
			watchDate: {
				contains: targetMonth,
			},
		},
		orderBy: {
			watchDate: "desc",
		},
		include: {
			user: true,
		},
	});

	return targetMonth === month
		? {
				month,
				movies: movies.slice(1),
			}
		: {
				month,
				movies: movies,
			};
}

export async function getMoviesUntil(date: string) {
	console.log("getting movies until", date);
	const movies = await prisma.movie.findMany({
		where: {
			watchDate: {
				lte: date,
			},
		},
		include: {
			reviews: true,
			ratings: true,
			user: true,
		},
	});

	const sorted = movies.sort((a, b) =>
		sortByISODate(a.watchDate ?? "", b.watchDate ?? "", "desc"),
	);

	const grouped = groupBy(
		sorted,
		(movie) => movie?.watchDate?.split("-").splice(0, 2).join("-") ?? "",
	);

	return grouped;
}

export async function getAllMoviesOfTheWeek() {
	const nextMovieDate = set(nextWednesday(new Date()), {
		hours: 18,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	const now = isWednesday(new Date())
		? set(new Date(), { hours: 19, minutes: 0, seconds: 0, milliseconds: 0 })
		: nextMovieDate;

	const movies = await prisma.movie.findMany({
		where: {
			movieOfTheWeek: {
				lte: now,
			},
		},
		include: {
			reviews: true,
			ratings: true,
			user: true,
		},
	});

	return movies;
}

export async function getMoviesOfTheWeek() {
	return await prisma.movie.findMany({
		where: {
			watchDate: {
				not: null,
			},
		},
		include: {
			reviews: true,
			ratings: true,
			user: true,
		},
	});
}

export async function getMovie(id: string) {
	const movie = await prisma.movie.findUnique({
		where: {
			id: id,
		},
		include: {
			reviews: {
				include: {
					user: true,
				},
			},
			ratings: true,
			user: true,
		},
	});

	const details = movie ? await getAdditionalInfo(movie?.tmdbId) : {};

	if (movie) {
		const movieObject = Object.assign(
			movie,
			details,
		) as unknown as MovieOfTheWeek;

		return movieObject;
	}
}

export async function createReview(
	review: string,
	userId: string,
	movieId: string,
) {
	const data = await prisma.review.create({
		data: {
			content: review,
			userId: userId,
			movieId: movieId,
			timestamp: format(new Date(), "dd/MM/yyyy H:m"),
		},
	});

	return data;
}

export async function simulateRaffle(repetitions: number) {
	const shortlists = await getAllShortLists();
	const resultArr: ChosenMovie[] = [];
	let lastChosen: User;
	for (let i = 0; i < repetitions; i++) {
		const movies = shortlists.flatMap((shortlist) => {
			if (i > 15 && shortlist.user.id === lastChosen?.id) {
				return {
					user: shortlist.user,
					shortlistId: shortlist.id,
					movie: shortlist.movies[0],
				};
			}
			if (shortlist.movies.length < 3) {
				const movie = shortlist.movies[0];
				return [
					{
						user: shortlist.user,
						shortlistId: shortlist.id,
						movie: { ...movie },
					},
					{
						user: shortlist.user,
						shortlistId: shortlist.id,
						movie: { ...movie },
					},
					{
						user: shortlist.user,
						shortlistId: shortlist.id,
						movie: { ...movie },
					},
				];
			}
			return shortlist.movies.map((movie) =>
				Object.assign(
					{},
					{
						user: shortlist.user,
						shortlistId: shortlist.id,
						movie: movie,
					},
				),
			);
		});
		const shuffledMovies = shuffle(movies);

		const chosen = sample(shuffledMovies, true);

		if (chosen) {
			resultArr.push(chosen as unknown as ChosenMovie);
			lastChosen = chosen.user;
		}
	}

	const moviesByUser = countByKey(resultArr, (movie) => {
		return movie?.user?.name ?? "";
	});

	const dataObj = {
		label: "Movies by user",
		data: [],
	} as UserChartData;

	for (const user in moviesByUser) {
		dataObj.data.push({
			user: user,
			movies: moviesByUser[user],
		});
	}
	return dataObj;
}

export async function chooseMovieOfTheWeek() {
	// get an array of all the movies and the user - Array<{user, movie}>
	let shortlists = await getAllShortLists();
	shortlists = shortlists.filter((shortlist) => shortlist.participating);

	const selectionRequired = shortlists.filter(
		(shortlist) => !!shortlist.requiresSelection,
	);

	if (selectionRequired.length > 0) {
		for (const listItem of selectionRequired) {
			if (
				listItem.selectedIndex === undefined ||
				listItem.selectedIndex === null
			) {
				throw new Error(
					`${listItem.user.name} needs to select a movie to include`,
				);
			}
		}
	}

	const notReady = shortlists.filter((shortlist) => !shortlist.isReady);
	//const allReady = every(shortlists, (shortlist) => shortlist.isReady)

	if (notReady.length > 0) {
		throw new Error(
			`Not all users are ready: ${notReady
				.map((item) => item.user.name)
				.join(", ")}`,
		);
	}

	const movies = shortlists.flatMap((shortlist) => {
		if (shortlist.requiresSelection) {
			return {
				user: shortlist.user,
				shortlistId: shortlist.id,
				movie: shortlist.movies[shortlist.selectedIndex ?? 0],
			};
		}

		return shortlist.movies.map((movie) =>
			Object.assign(
				{},
				{
					user: shortlist.user,
					shortlistId: shortlist.id,
					movie: movie,
				},
			),
		);
	});
	// shuffle a few times
	const shuffledMovies = shuffle(movies);
	const chosen = sample(shuffledMovies, true);

	let movieObject = await getMovie(chosen?.movie.id ?? "");

	/**
	 * For some reason some times including the user in the movie retrieved from db fails
	 * so we need to add it manually just in case
	 */

	if (!movieObject?.user) {
		movieObject = {
			...movieObject,
			user: chosen?.user,
		} as MovieOfTheWeek;
	}

	// update movie with the date
	// reset selection state for the current week's winner
	// set restrictions to new winner

	await updateChosenMovie(movieObject, chosen?.user.id ?? "");

	const raffle = await prisma.raffle.create({
		data: {
			participants: {
				connect: shortlists.map((shortlist) => ({ id: shortlist.user.id })),
			},
			movies: {
				connect: movies.map((movie) => ({ id: movie.movie.id })),
			},
			winningMovieID: chosen?.movie.id ?? "",
			date: formatISO(new Date(), {
				representation: "date",
			}),
		},
	});

	for (const item of shortlists) {
		await updateShortlistState(false, item.id);

		const inSelectionRequired = selectionRequired.find(
			(listItem) => listItem.id === item.id,
		);
		if (inSelectionRequired) {
			await updateShortlistSelectionStatus(false, item.id);
		}

		if (item.id === chosen?.shortlistId) {
			await updateShortlistSelectionStatus(true, item.id);
		}

		// finally, wipe the chosen movie from all shortlists
		const movieInShortlist = item.movies.find(
			(movie) => movie.id === chosen?.movie.id,
		);

		if (movieInShortlist) {
			await removeMovieFromShortlist(movieInShortlist.id, item.id);
		}
	}

	return {
		...movieObject,
		movieOfTheWeek: getNextDate(),
		watchDate: getNextDate(),
		owner: chosen?.user.name,
	} as MovieOfTheWeek;
}

export async function postRaffleWork({
	movies,
	winner,
	startingUserId,
}: {
	movies: MovieWithUser[];
	winner: MovieWithUser;
	startingUserId: string;
}) {
	// estimate the time it takes to run the raffle
	// 200ms per movie * 4 rounds + 500ms per movie for the last round is the absolute maximum
	const runtime = movies.length * 4 * 200 + movies.length * 500;

	// await the timeout
	await new Promise((resolve) => setTimeout(resolve, runtime));
	console.log("Raffle finished");

	const participants = [...new Set(movies.map((movie) => movie.user.id))];

	// create a raffle record
	await prisma.raffle.create({
		data: {
			participants: {
				connect: participants.map((participant) => ({ id: participant })),
			},
			movies: {
				connect: movies.map((movie) => ({ id: movie.id })),
			},
			winningMovieID: winner.id ?? "",
			date: formatISO(new Date(), {
				representation: "date",
			}),
		},
	});

	// update the winner with the watch date
	await updateChosenMovie(winner, winner.user.id);

	// update shortlist states, remove the winning movie from all shortlists
	for (const participant of participants) {
		const shortlist = await prisma.shortlist.findUnique({
			where: {
				userId: participant,
			},
			include: {
				movies: true,
			},
		});
		const movieInShortlist = shortlist?.movies.find(
			(movie) => movie.id === winner.id,
		);

		await updateShortlistState(false, shortlist?.id ?? "");
		await updateShortlistSelectionStatus(
			participant === winner.user.id,
			shortlist?.id ?? "",
		);
		if (movieInShortlist) {
			await removeMovieFromShortlist(movieInShortlist.id, shortlist?.id ?? "");
		}
	}
	console.log("sending notification");
	sendNotification(
		{ message: `${winner.user.name} won the raffle!` },
		startingUserId,
	);
}

export async function updateChosenMovie(movie: Movie, userId: string) {
	const nextDate = getNextDate();

	const updatedMovie = await prisma.movie.update({
		where: {
			id: movie.id,
		},
		data: {
			watchDate: nextDate,
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});

	return updatedMovie;
}

export async function connectChosenMovies(movies: ChosenMovie[]) {
	const users: Record<string, string> = {
		Juhani: "64aec109b56d6dd5a8489cb4",
		Jussi: "64b825e750ebc52d19bc72e7",
		Miika: "648875d9b274755f19862cbf",
		Niko: "64b7c8d13be96d82bde4a930",
	};
	for (const movie of movies) {
		const username = movie.user;

		if (username) {
			// retrieve the movie
			const movieData = await prisma.movie.findUnique({
				where: {
					tmdbId: movie.movie.tmdbId,
				},
			});

			if (!movieData?.userId) {
				const res = await prisma.movie.update({
					where: {
						id: movieData?.id,
					},
					data: {
						user: {
							connect: {
								id: users[username.name],
							},
						},
					},
				});
			}
		}
	}

	return movies;
}

export async function getStatistics() {
	const movies = await prisma.movie.findMany({
		where: {
			watchDate: {
				not: null,
			},
		},
		include: {
			user: true,
		},
	});

	const moviesByUser = countByKey(movies, (movie) => {
		return movie.user?.name ?? "";
	});

	const dataArr = [];
	const dataObj = {
		label: "Movies by user",
		data: [],
	} as UserChartData;

	for (const user in moviesByUser) {
		dataObj.data.push({
			user: user,
			movies: moviesByUser[user],
		});
	}
	dataArr.push(dataObj);
	return dataObj;
}

function getNextDate() {
	return formatISO(nextWednesday(new Date()), {
		representation: "date",
	});

	/*
  return set(nextWednesday(new Date()), {
    hours: 18,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });*/
}
