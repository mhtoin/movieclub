"use client";
import { useSocket, useValidateSession } from "@/lib/hooks";
import * as Ariakit from "@ariakit/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Link } from "react-aria-components";
import MenuItem from "./MenuItem";

export default function ProfileMenu() {
	const { data: user, status } = useValidateSession();
	const [open, setOpen] = useState(false);
	const menu = Ariakit.useMenuStore({ open, setOpen });
	const { isConnected, isConnecting } = useSocket();

	return (
		<Ariakit.MenuProvider>
			<Ariakit.MenuButton
				className="relative w-12 h-12 border rounded-full  flex items-center justify-center focus:outline-none"
				store={menu}
				onMouseEnter={() => menu.show()}
				onMouseLeave={() => menu.hide()}
			>
				{user && status === "success" ? (
					<Image
						src={user?.image || ""}
						alt="P"
						fill
						className="object-cover rounded-full"
					/>
				) : (
					<Loader2 className="animate-spin" />
				)}
				<div
					className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
						isConnected ? "bg-success" : "bg-error"
					} ${isConnecting ? "animate-loading-pulse" : ""}`}
				/>
			</Ariakit.MenuButton>
			<Ariakit.Menu
				className="menu z-[9999] focus:outline-none"
				shift={-60}
				gutter={12}
				onMouseLeave={() => menu.hide()}
				store={menu}
			>
				<nav data-magnetic className="z-[9999]">
					<ul>
						<MenuItem store={menu}>
							<Link href={"/dashboard"} className="text-lg text-foreground">
								Profile
							</Link>
						</MenuItem>
						<MenuItem store={menu}>
							<Link href={"/logout"} className="text-lg text-foreground">
								Logout
							</Link>
						</MenuItem>
					</ul>
				</nav>
			</Ariakit.Menu>
		</Ariakit.MenuProvider>
	);
}
