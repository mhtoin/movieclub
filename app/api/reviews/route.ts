import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const params = request.nextUrl.searchParams;
	const id = params.get("id");
	const content = await request.json();

	console.log("id", id);
	console.log("content", content);

	return NextResponse.json({ message: "Review saved" });
}
