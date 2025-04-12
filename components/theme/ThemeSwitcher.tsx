"use client";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

export default function ThemeSwitcher() {
	const [theme, setTheme] = useState(global.window?.__theme || "light");
	const [_accentColor, setAccentColor] = useState(global.window?.__accent || "");
	//const [open, setOpen] = useState(false);
	//const isMobile = useIsMobile();
	//const menu = Ariakit.useMenuStore({ open, setOpen });

	/*
	const accents = [
		{
			label: "Default",
			color: "hsl(203, 5%, 35%)",
		},
		{
			label: "Aqua",
			color: "#163b40",
		},
		{
			label: "Orange",
			color: "#ff9900",
		},
		{
			label: "Magenta",
			color: "#e91e63",
		},
		{
			label: "Purple",
			color: "#7e1e8f",
		},
	];*/

	/*
	useEffect(() => {
		if (theme) {
			createThemeCookie("theme", theme);
		}
	}, [theme]);

	useEffect(() => {
		if (accentColor !== undefined) {
			createThemeCookie("accent", accentColor);
		}
	}, [accentColor]);
  */

	const toggleTheme = (theme: "light" | "dark") => {
		global.window?.__setPreferredTheme(theme);
	};

	/*
	const toggleAccent = (accent: string) => {
		global.window?.__setPreferredAccent(accent);
	};*/

	useEffect(() => {
		global.window.__onThemeChange = setTheme;
		global.window.__onAccentChange = setAccentColor;
	}, []);

	return (
		<Button
			variant={"ghost"}
			size={"icon"}
			onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
			className="relative overflow-hidden hover:bg-transparent group"
		>
			<div className="relative w-full h-full flex items-center justify-center">
				<motion.div
					animate={{
						opacity: theme === "dark" ? 1 : 0,
						y: theme === "dark" ? 0 : 10,
						scale: theme === "dark" ? 1 : 0.5,
					}}
					transition={{ duration: 0.3 }}
					className="absolute"
				>
					<MoonIcon className="font-bold shadow-lg h-5 w-5 drop-shadow-lg group-hover:text-gray-300 group-hover:drop-shadow-md transition-all duration-300" />
				</motion.div>

				<motion.div
					animate={{
						opacity: theme === "light" ? 1 : 0,
						y: theme === "light" ? 0 : -10,
						scale: theme === "light" ? 1 : 0.5,
					}}
					transition={{ duration: 0.3 }}
					className="absolute"
				>
					<SunIcon className="text-yellow-700 font-bold drop-shadow-lg h-5 w-5 group-hover:text-yellow-500 group-hover:drop-shadow-md transition-all duration-300" />
				</motion.div>
			</div>
		</Button>
	);

	/*
	if (isMobile) {
		return (
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						onTouchStart={() => setOpen(true)}
					>
						{theme === "light" ? <SunIcon /> : <MoonIcon />}
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="flex flex-col gap-5 p-5 pb-10">
						<span>Theme</span>
						<div className="flex gap-5">
							<div className="flex flex-col gap-2 justify-center items-center">
								<Label className="text-xs">Light</Label>
								<Button
									variant={"outline"}
									size={"icon"}
									onClick={() => toggleTheme("light")}
								>
									<SunIcon />
								</Button>
							</div>
							<div className="flex flex-col gap-2 justify-center items-center">
								<Label className="text-xs">Dark</Label>
								<Button
									variant={"outline"}
									size={"icon"}
									onClick={() => toggleTheme("dark")}
								>
									<MoonIcon />
								</Button>
							</div>
						</div>
						<span>Accent</span>
						<div className="flex gap-5 flex-wrap">
							{accents?.map((accent) => (
								<div key={accent.label} className="flex flex-col gap-2">
									<Label className="text-xs">{accent.label}</Label>
									<Button
										variant={"outline"}
										size={"icon"}
										onClick={() => toggleAccent(accent.label)}
									>
										<div
											className="w-5 h-5 rounded-full"
											style={{ backgroundColor: accent.color }}
										/>
									</Button>
								</div>
							))}
						</div>
					</div>
				</DrawerContent>
			</Drawer>
		);
	}
	return (
		<Ariakit.MenuProvider>
			<Ariakit.MenuButton
				render={<Button variant={"outline"} size={"icon"} />}
				store={menu}
				onMouseEnter={() => menu.show()}
				onMouseLeave={() => menu.hide()}
				className="focus:outline-hidden"
			>
				{theme === "light" ? <SunIcon /> : <MoonIcon />}
			</Ariakit.MenuButton>
			<Ariakit.Menu
				className="menu popover z-9990 focus:outline-hidden"
				gutter={12}
				shift={-60}
				store={menu}
				onMouseLeave={() => menu.hide()}
			>
				<Ariakit.PopoverArrow className="arrow bg-gray-50" />
				<span>Theme</span>
				<div className="flex gap-5">
					<Ariakit.MenuItem className="flex flex-col gap-2">
						<Label className="text-xs">Light</Label>
						<Button
							variant={"outline"}
							size={"icon"}
							onClick={() => toggleTheme("light")}
						>
							<SunIcon />
						</Button>
					</Ariakit.MenuItem>
					<Ariakit.MenuItem className="flex flex-col gap-2">
						<Label className="text-xs">Dark</Label>
						<Button
							variant={"outline"}
							size={"icon"}
							onClick={() => toggleTheme("dark")}
						>
							<MoonIcon />
						</Button>
					</Ariakit.MenuItem>
				</div>
				<Ariakit.MenuSeparator className="separator" />
				<span>Accent</span>
				<div className="flex gap-5 flex-wrap">
					{accents?.map((accent) => (
						<Ariakit.MenuItem
							key={accent.label}
							className="flex flex-col gap-2"
						>
							<Label className="text-xs">{accent.label}</Label>
							<Button
								variant={"outline"}
								size={"icon"}
								onClick={() => toggleAccent(accent.label)}
							>
								<div
									className="w-5 h-5 rounded-full"
									style={{ backgroundColor: accent.color }}
								/>
							</Button>
						</Ariakit.MenuItem>
					))}
				</div>
			</Ariakit.Menu>
		</Ariakit.MenuProvider>
	);*/
}
