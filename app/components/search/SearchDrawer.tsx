import { Button } from "@/app/components/ui/Button";
import { Drawer, DrawerContent } from "@/app/components/ui/Drawer";
import { useDialogStore } from "@/stores/useDialogStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Search from "./Search";

export default function SearchDrawer() {
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
		<Drawer
			open={open}
			setBackgroundColorOnScale={false}
			shouldScaleBackground={true}
			onOpenChange={() => {
				if (initialRoute) {
					setOpen(false);
					router.push(initialRoute);
				} else {
					setOpen(false);
					router.back();
				}
			}}
		>
			<DrawerContent className="max-h-[97dvh]">
				<Search />
			</DrawerContent>
		</Drawer>
	);
}
