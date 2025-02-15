import {
  updateShortlistParticipationState,
} from "@/lib/shortlist";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { participating } = await request.json();
  const res = await updateShortlistParticipationState(participating, params.id);

  return NextResponse.json(res);
}
