import { useRouter } from "next/navigation";
import AriaDialog from "../ui/AriaDialog";
import FilterBar from "./FilterBar";
import Results from "./Results";

import { useDialogStore } from "@/stores/useDialogStore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchDialog() {
	const router = useRouter();
	const pathname = usePathname();
	const { initialRoute } = useDialogStore();
	const [open, setOpen] = useState(true);
	useEffect(() => {
		if (pathname === "/search") {
			setOpen(true);
		}
	}, [pathname]);
	return (
		<AriaDialog
			title="Search"
			open={open}
			onClose={() => {
				if (initialRoute) {
					setOpen(false);
					router.push(initialRoute);
				} else {
					setOpen(false);
					router.back();
				}
			}}
		>
			<div className="flex flex-col justify-center items-center gap-2 rounded-lg relative h-full">
				<div className="sticky z-40 top-0 w-full bg-background pb-2">
					<FilterBar />
				</div>

				<Results />
			</div>
		</AriaDialog>
	);
}
