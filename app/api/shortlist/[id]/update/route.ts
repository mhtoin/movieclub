import { getCurrentSession } from "@/lib/authentication/session";
import { ShortlistLimitError, connectMovieToShortlist } from "@/lib/shortlist";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { user } = await getCurrentSession();
    if (!user || user.shortlistId !== params.id) {
		return NextResponse.json(
			{ ok: false, message: "Unauthorized" },
			{ status: 401 },
		);
	}
    const { movie } = await request.json();
    const movieId = "id" in movie ? movie.id : movie.tmdbId;
    const shortlistId = params.id;

    try {
		const updatedShortlist = await connectMovieToShortlist(movieId, shortlistId);
		return NextResponse.json(updatedShortlist);
	} catch (e) {
		if (e instanceof ShortlistLimitError) {
			return NextResponse.json(
				{ ok: false, message: e.message, code: e.code, limit: e.limit },
				{ status: 409 },
			);
		}
		if (e instanceof Error) {
			return NextResponse.json({ ok: false, message: e.message }, { status: 400 });
		}
	}
}
