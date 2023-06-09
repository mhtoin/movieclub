import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");

    const movies = await collection.find({}).toArray();

    console.log("shortlist", movies);
    console.log('request', request)
    return NextResponse.json({ movies });
  } catch (e) {
    console.error(e);
  }
}

export async function POST(request: NextRequest, response: Response) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");
    const body = await request.json();

    const res = await collection.insertOne(body);
    console.log(request.nextUrl);

    //const movies = await collection.find({}).toArray();
    const tag = request.nextUrl.searchParams.get("tag");
    console.log('tag', tag)
    revalidateTag('shortlist');

    return NextResponse.json({ res });
  } catch (e) {
    console.error(e);
  }
}
