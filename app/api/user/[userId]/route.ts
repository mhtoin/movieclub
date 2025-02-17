import { updateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function PUT(
	request: Request,
	{ params }: { params: { userId: string } },
) {
	const body = await request.json();
	const res = await updateUser(body, params.userId);

	return NextResponse.json(res);
}
