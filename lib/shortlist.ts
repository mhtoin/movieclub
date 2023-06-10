import clientPromise from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";

export const revalidate = 10

export async function getShortlist() {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");

    const movies =  await collection.find<Movie>({}).toArray();
    return movies
  } catch (e) {
    console.error(e);
  }
}

export async function addMovieToShortlist(movie: object) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");
    

    const res = await collection.insertOne(movie);

    //revalidateTag("shortlist");

    //return res
  } catch (e) {
    console.error(e);
  }
}


export async function removeMovieFromShortlist(id: string) {
  try {
    const client = await clientPromise;
    const collection = client.db("movieclub").collection("shortlist");
    const res = await collection.deleteOne({ _id: new ObjectId(id) });

    //return NextResponse.json({ message: "Deleted succesfully" });
  } catch (e) {
    console.log(e);
  }
}
