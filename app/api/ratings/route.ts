import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export async function POST(request: NextRequest) {
	const params = request.nextUrl.searchParams;
	const id = params.get("id");
	const { rating } = await request.json();

	if (!id) {
		return NextResponse.json({ message: "No id provided" }, { status: 400 });
	}

	await prisma?.tierMovie.update({
		where: { id },
		data: { rating: rating.toString() },
	});

	revalidatePath("/home");

	return NextResponse.json({ message: "Rating saved" });
}
