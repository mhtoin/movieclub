"use client";
import { useIsMobile } from "lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import FilterBar from "./FilterBar";
import Results from "./Results";
import SearchDialog from "./SearchDialog";
import SearchDrawer from "./SearchDrawer";

export default function SearchModal() {
	const router = useRouter();
	const pathname = usePathname();
	const isMobile = useIsMobile();
	return isMobile ? <SearchDrawer /> : <SearchDialog />;
}
