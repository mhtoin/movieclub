import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const params = request.nextUrl.searchParams;
	const id = params.get("id");
	const { content } = await request.json();

	console.log("id", id);
	console.log("content", content);

	if (!id) {
		return NextResponse.json({ message: "No id provided" }, { status: 400 });
	}

	await prisma?.tierMovie.update({
		where: {
			id: id,
		},
		data: {
			review: content,
		},
	});

	return NextResponse.json({ message: "Review saved" });
}
