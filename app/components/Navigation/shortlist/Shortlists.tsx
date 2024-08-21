"use client";
import { useShortlistsQuery, useSuspenseShortlistsQuery } from "@/lib/hooks";
import { useSession } from "next-auth/react";
import ShortlistCard from "./ShortlistCard";
import { Suspense } from "react";

export default function Shortlists() {
  const { data: session, status: sessionStatus } = useSession();
  const {
    data: allShortlists,
    isLoading,
    status,
  } = useSuspenseShortlistsQuery();
  const userShortlist = allShortlists?.[session?.user?.shortlistId];

  return (
    <div className="pt-20 flex flex-col justify-center items-center">
      <main className="flex flex-col items-center gap-5 overflow-hidden p-2">
        <h3 className="text-2xl font-bold">Shortlists</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <ShortlistCard shortlist={userShortlist} />
          {session && sessionStatus === "authenticated" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
                if (shortlistId !== session?.user?.shortlistId) {
                  return (
                    <ShortlistCard key={shortlistId} shortlist={shortlist} />
                  );
                }
              })}
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}
