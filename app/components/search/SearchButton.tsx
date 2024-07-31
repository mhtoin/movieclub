"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchButton() {
  const router = useRouter();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/search?with_watch_providers=8");
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div
      className="border py-3 px-4 flex gap-5 items-center rounded-md bg-input"
      onClick={() => router.push("/search?with_watch_providers=8")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          router.push("/search");
        }
      }}
    >
      Search movies...
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
}
