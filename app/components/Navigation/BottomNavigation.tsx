"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks";
import { MobileRaffleButton } from "@/app/components/MobileRaffleButton";

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useDebounce(() => {
    const currentScrollPos = window.scrollY;
    const visible = prevScrollPos >= currentScrollPos;

    setPrevScrollPos(currentScrollPos);
    setVisible(visible);
  }, 30);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div className="fixed w-full bottom-0 left-0 right-0 h-10 border"></div>
  );
}
