"use client";
import { usePathname, useRouter } from "next/navigation";
import AriaDialog from "../ui/AriaDialog";
import Search from "./Search";
import useWindowSize from "@/lib/getWindowSize";
import { useIsMobile } from "@/lib/hooks";
import SearchDrawer from "./SearchDrawer";
import FilterBar from "./FilterBar";
import Results from "./Results";

export default function SearchModal() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  return isMobile ? (
    <SearchDrawer />
  ) : (
    <AriaDialog title="Search" onClose={() => router.back()}>
      <div className="flex flex-col justify-center items-center gap-2 rounded-lg relative">
        <div className="sticky z-40 top-0 w-full bg-background pb-2">
          <FilterBar />
        </div>

        <Results />
      </div>
    </AriaDialog>
  );
}
