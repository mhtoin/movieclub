import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(request: Request, response: Response) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");

    const movies = await collection.find({}).toArray();

    return NextResponse.json({ movies });
  } catch (e) {
    console.error(e);
  }
}
