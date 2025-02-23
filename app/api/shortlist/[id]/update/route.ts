import { connectMovieToShortlist } from "@/lib/shortlist";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { movie } = await request.json();
	const movieId = "id" in movie ? movie.id : movie.tmdbId;
	const shortlistId = params.id;

	try {
		const updatedShortlist = await connectMovieToShortlist(movieId, shortlistId);
		return NextResponse.json(updatedShortlist);
	} catch (e) {
		if (e instanceof Error) {
			return NextResponse.json({ ok: false, message: e.message }, { status: 401 });
		}
	}
}
