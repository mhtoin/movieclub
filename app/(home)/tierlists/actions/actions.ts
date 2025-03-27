"use server";
import { createTierlist } from "@/lib/tierlists";
import { redirect } from "next/navigation";

export async function createNewTierlist(formData: FormData) {
	await createTierlist(formData);
	redirect("/tierlists/");
	//return createTierlist
}
