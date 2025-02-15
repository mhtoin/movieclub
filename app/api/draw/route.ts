import { simulateRaffle } from "@/lib/movies/movies";
// @ts-nocheck
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, _response: NextResponse) {
	try {
		// get all shortlists and check that everyone is ready
		const body = await request.json();
		const repetitions = body.repetitions ? body.repetitions : 1;
		const movies = await simulateRaffle(repetitions);

		return NextResponse.json(movies, { status: 200 });
	} catch (e) {
		console.error("error", e);
		if (e instanceof Error) {
			return NextResponse.json(
				{ ok: false, message: e.message },
				{ status: 401 },
			);
		}
		return NextResponse.json(
			{ ok: false, message: "Something went wrong!" },
			{ status: 500 },
		);
	}
}
