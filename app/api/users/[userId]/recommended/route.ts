import { getUserRecommendedMovies } from "@/lib/users/users";
import { NextResponse } from "next/server";
export async function GET(
	_request: Request,
	{ params }: { params: { userId: string } },
) {
	if (!params?.userId) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	const recommended = await getUserRecommendedMovies(params.userId);

	return NextResponse.json(recommended);
}
