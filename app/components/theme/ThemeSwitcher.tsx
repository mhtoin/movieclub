"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import * as Ariakit from "@ariakit/react";
import { Label } from "react-aria-components";
import { createThemeCookie } from "@/lib/actions/setThemeCookie";

export default function ThemeSwitcher({
  userTheme,
  userAccentColor,
}: {
  userTheme: "light" | "dark" | undefined;
  userAccentColor: string | undefined;
}) {
  const [theme, setTheme] = useState<"light" | "dark" | undefined>(userTheme);
  const [accentColor, setAccentColor] = useState(userAccentColor || "");
  const [open, setOpen] = useState(false);
  const menu = Ariakit.useMenuStore({ open, setOpen });
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
  ];

  useEffect(() => {
    if (document !== undefined) {
      if (!userTheme && !theme) {
        setTheme(
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        );
      }
      document.documentElement.classList.toggle("light", theme === "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, userTheme]);

  useEffect(() => {
    if (document !== undefined) {
      document.documentElement.setAttribute("data-accent", accentColor);
    }
  }, [accentColor]);
  const handleThemeSwitch = async (theme: "light" | "dark") => {
    setTheme(theme);
    await createThemeCookie("theme", theme);
  };

  const handleAccentSwitch = async (color: string) => {
    setAccentColor(color === "Default" ? "" : color.toLowerCase());
    // TODO: Server action to save to cookie
    await createThemeCookie(
      "accent",
      color === "Default" ? "" : color.toLowerCase()
    );
  };
  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton
        render={<Button variant={"outline"} size={"icon"} />}
        store={menu}
        onMouseEnter={() => menu.show()}
        onMouseLeave={() => menu.hide()}
      >
        {theme === "light" ? <SunIcon /> : <MoonIcon />}
      </Ariakit.MenuButton>
      <Ariakit.Menu
        className="menu popover z-[9990]"
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
              onClick={() => handleThemeSwitch("light")}
            >
              <SunIcon />
            </Button>
          </Ariakit.MenuItem>
          <Ariakit.MenuItem className="flex flex-col gap-2">
            <Label className="text-xs">Dark</Label>
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => handleThemeSwitch("dark")}
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
                onClick={() => handleAccentSwitch(accent.label)}
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
  );
}
