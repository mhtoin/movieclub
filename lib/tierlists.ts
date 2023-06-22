import prisma from "./prisma";
import { ObjectId, OptionalId } from "mongodb";
import { Prisma } from "@prisma/client";
import { getAdditionalInfo } from "./tmdb";
import { endOfDay, isWednesday, nextWednesday, set } from "date-fns";

export const revalidate = 10;

export async function getTierlists() {
    return await prisma.tierlists.findMany()
}

export async function getTierlist(id: string) {
    return await prisma.tierlists.findUnique({
        where: {
            id: id
        }
    })
}