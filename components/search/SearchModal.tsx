"use client";
import { useIsMobile } from "lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import SearchDialog from "./SearchDialog";
import SearchDrawer from "./SearchDrawer";

export default function SearchModal() {
	const _router = useRouter();
	const _pathname = usePathname();
	const isMobile = useIsMobile();
	return isMobile ? <SearchDrawer /> : <SearchDialog />;
}
