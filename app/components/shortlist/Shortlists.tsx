"use client";
import { useSuspenseShortlistsQuery, useValidateSession } from "@/lib/hooks";
import ShortlistCard from "components/shortlist/ShortlistCard";
import { Suspense } from "react";
import ShortlistSidebar from "./ShortlistSidebar";

export default function Shortlists() {
  const { data: user } = useValidateSession();

  const {
    data: allShortlists,
    isLoading,
    status,
  } = useSuspenseShortlistsQuery();
  const userShortlist = user?.shortlistId
    ? allShortlists?.[user?.shortlistId]
    : null;

  return (
    <div className="pt-16 flex flex-row no-scrollbar border h-screen">
      <ShortlistSidebar />
      <main className="flex flex-col items-center gap-5 overflow-hidden p-2 border w-full h-full">
        <h3 className="text-2xl font-bold">Shortlists</h3>
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(allShortlists).map(([shortlistId, shortlist]) => {
              if (shortlistId !== user?.shortlistId) {
                return (
                  <ShortlistCard key={shortlistId} shortlist={shortlist} />
                );
              }
            })}
          </div>
        )}
      </main>
    </div>
  );
}
