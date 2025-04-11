"use client";

import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("./Navbar"), {
	ssr: false,
});

export default function NavbarWrapper() {
	return <NavBar />;
}
