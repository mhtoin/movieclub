import { inter } from "@/app/fonts";
import useMedia from "@/lib/useMedia";
import { cn } from "@/lib/utils";
import * as Ariakit from "@ariakit/react";
import { useState } from "react";

interface PopoverProps {
  label: string;
  children: React.ReactNode;
}

export default function Popover({ label, children }: PopoverProps) {
  const popover = Ariakit.usePopoverStore();
  const [value, setValue] = useState<string[]>([]);
  const isLarge = useMedia("(min-width: 640px)", true);
  const isOpen = popover.useState("open");

  const updatePosition = () => {
    const { popoverElement, mounted } = popover.getState();
    if (!popoverElement) return;
    Object.assign(popoverElement.style, {
      display: mounted ? "block" : "none",
      position: "fixed",
      width: "100%",
      bottom: "0px",
      padding: "12px",
    });
  };

  return (
    <Ariakit.PopoverProvider store={popover}>
      <Ariakit.PopoverDisclosure
        className={cn(
          "flex flex-none h-10 select-none items-center gap-1 whitespace-nowrap rounded-lg border pl-4 pr-4 text-[1rem] leading-6 text-accent-foreground [text-decoration-line:none] outline-[2px] outline-offset-[2px] [box-shadow:inset_0_0_0_1px_var(--border),_inset_0_2px_0_var(--highlight),_inset_0_-1px_0_var(--shadow),_0_1px_1px_var(--shadow)] justify-between",
          "border-accent/80"
        )}
      >
        {label}
        <Ariakit.SelectArrow
          className={`transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </Ariakit.PopoverDisclosure>
      <Ariakit.Popover
        modal={!isLarge}
        backdrop={isLarge ? false : <div className="" />}
        updatePosition={isLarge ? undefined : updatePosition}
        className="z-50 border bg-popover p-4 rounded-lg"
      >
        {isLarge && <Ariakit.PopoverArrow className="arrow" />}
        {children}
      </Ariakit.Popover>
    </Ariakit.PopoverProvider>
  );
}
