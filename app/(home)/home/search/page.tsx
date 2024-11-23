import FilterBar from "@/app/components/search/FilterBar";
import Results from "@/app/components/search/Results";
import Search from "@/app/components/search/Search";
import { getCurrentSession } from "@/lib/authentication/session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function SearchPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect("/");
  }
  return (
    <div className="flex flex-col justify-center items-center gap-2 rounded-lg relative">
      <div className="sticky z-40 top-0 pt-12 w-full bg-background pb-2">
        <FilterBar />
      </div>
      <Results />
    </div>
  );
}
