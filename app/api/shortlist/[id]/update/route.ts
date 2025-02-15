import { connectMovieToShortlist } from "@/lib/shortlist";
import { type NextRequest, NextResponse } from "next/server";

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { movieId } = await request.json();
	const shortlistId = params.id;

	const updatedShortlist = await connectMovieToShortlist(movieId, shortlistId);

	return NextResponse.json(updatedShortlist);
}
