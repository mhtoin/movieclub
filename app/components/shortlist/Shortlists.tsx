"use client";
import { useSuspenseShortlistsQuery, useValidateSession } from "@/lib/hooks";
import ShortlistCard from "components/shortlist/ShortlistCard";
import { Suspense } from "react";
import ShortlistSidebar from "./ShortlistSidebar";
import { useIsMobile } from "@/lib/hooks";
import ShortlistDrawer from "./ShortlistDrawer";
import { LoaderCircle } from "lucide-react";

export default function Shortlists() {
  const { data: user } = useValidateSession();
  const isMobile = useIsMobile();

  const {
    data: allShortlists,
    isLoading,
    status,
  } = useSuspenseShortlistsQuery();

  if (isMobile === undefined || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="pt-16 flex flex-row no-scrollbar h-dvh overflow-hidden">
        <div className="fixed bottom-0 left-0 z-10">
          <ShortlistDrawer />
        </div>
        <main className="flex flex-col items-center justify-center gap-5 p-2 pt-10 w-full h-full">
          <div className="relative bg-secondary w-1/2 h-[1px]">
            <h3 className="text-2xl font-bold absolute -top-4 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
              Shortlists
            </h3>
          </div>
          {user && (
            <div className="grid grid-cols-1 lg:grid-cols-2 4xl:grid-cols-3 gap-4 overflow-y-auto no-scrollbar">
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

  return (
    <div className="pt-16 flex flex-row h-screen overflow-hidden">
      <ShortlistSidebar />
      <main className="flex flex-col items-center justify-center gap-5 p-2 pt-10 w-full h-full">
        <div className="relative bg-secondary w-1/2 h-[1px]">
          <h3 className="text-2xl font-bold absolute -top-4 left-1/2 -translate-x-1/2 bg-background flex items-center justify-center px-2">
            Shortlists
          </h3>
        </div>
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 4xl:grid-cols-3 gap-4 overflow-y-auto no-scrollbar p-5">
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
