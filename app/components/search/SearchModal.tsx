"use client";
import { usePathname, useRouter } from "next/navigation";
import AriaDialog from "../ui/AriaDialog";
import Search from "./Search";
import useWindowSize from "@/lib/getWindowSize";
import { useIsMobile } from "@/lib/hooks";
import SearchDrawer from "./SearchDrawer";
import FilterBar from "./FilterBar";
import Results from "./Results";
import SearchDialog from "./SearchDialog";

export default function SearchModal() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  return isMobile ? <SearchDrawer /> : <SearchDialog />;
}
