"use client";
import SearchButton from "../search/SearchButton";
import Menubar from "./Menubar";
import ProfileMenu from "./ProfileMenu";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import { useIsMobile } from "@/lib/hooks";
import { useEffect } from "react";
import { useState } from "react";
export const NavBar = ({
  theme,
  accent,
}: {
  theme: { value: string; name: string };
  accent: { value: string; name: string };
}) => {
  const isMobile = useIsMobile();

  // detect if the user has scrolled down
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // detect if the user has scrolled down an entire screen
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isMobile) {
    return (
      <div className="min-w-screen w-screen flex items-center justify-center border-b p-2 z-50 bg-background/80 backdrop-blur-md min-h-[70px] h-[70px] fixed top-0">
        <div className="w-full py-5 px-1 rounded flex justify-between items-center">
          <div className="flex items-center justify-center gap-2">
            <ProfileMenu />
            <span className="font-bold">leffaseura</span>
          </div>
          <div className="flex gap-2 h-full items-center">
            <ThemeSwitcher
              userTheme={theme?.value as "light" | "dark" | undefined}
              userAccentColor={accent?.value}
            />
            <SearchButton />
            <Menubar />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`min-w-screen w-screen flex items-center justify-center p-2 z-50 fixed top-0 h-[70px] min-h-[70px] transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      }`}
    >
      <div className="w-[90%] h-[70px] min-h-[70px] p-5 rounded hidden sm:flex justify-between items-center">
        {/**Right side */}
        <div className="flex items-center justify-center gap-5">
          {<Menubar />}
          <span className="font-bold">leffaseura</span>
        </div>
        <div className="flex gap-10 h-full items-center">
          <SearchButton />
          <ThemeSwitcher
            userTheme={theme?.value as "light" | "dark" | undefined}
            userAccentColor={accent?.value}
          />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};
