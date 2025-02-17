import {
	getMoviesOfTheWeek,
	getMoviesOfTheWeekByMonth,
} from "@/lib/movies/movies";
import type { MovieWithUser } from "@/types/movie.type";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
): Promise<
	NextResponse<
		| { month: string; movies: MovieWithUser[] }
		| MovieWithUser[]
		| { ok: boolean; message: string }
	>
> {
	const month = request.nextUrl.searchParams.get("month");
	if (month) {
		const movies = await getMoviesOfTheWeekByMonth(month);
		return NextResponse.json(movies, { status: 200 });
	}
	try {
		const movies = await getMoviesOfTheWeek();
		return NextResponse.json(movies, { status: 200 });
	} catch (e) {
		if (e instanceof Error) {
			return NextResponse.json({ ok: false, message: e.message }, { status: 401 });
		}
		return NextResponse.json(
			{ ok: false, message: "An unknown error occurred" },
			{ status: 500 },
		);
	}
}
