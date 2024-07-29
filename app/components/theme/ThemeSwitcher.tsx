import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import * as Ariakit from "@ariakit/react";
import { Label } from "react-aria-components";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [accentColor, setAccentColor] = useState("");
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
  ];

  useEffect(() => {
    // Read from local storage
    const theme = localStorage.getItem("theme") as "light" | "dark" | null;
    const accent = localStorage.getItem("accent") as string | null;
    if (theme) {
      setTheme(theme);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
      );
    }
    if (accent) {
      setAccentColor(accent);
    }
    if (document !== undefined) {
      document.documentElement.classList.toggle("light", theme === "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  useEffect(() => {
    if (document !== undefined) {
      document.documentElement.setAttribute("data-accent", accentColor);
    }
  }, [accentColor]);
  const handleThemeSwitch = (theme: "light" | "dark") => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const handleAccentSwitch = (color: string) => {
    console.log("color", color);
    setAccentColor(color === "Default" ? "" : color.toLowerCase());
    localStorage.setItem(
      "accent",
      color === "Default" ? "" : color.toLowerCase()
    );
  };
  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton render={<Button variant={"outline"} size={"icon"} />}>
        {theme === "light" ? <SunIcon /> : <MoonIcon />}
      </Ariakit.MenuButton>
      <Ariakit.Menu className="menu popover z-[9990]">
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
