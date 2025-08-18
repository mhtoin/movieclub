import { usePathname } from "next/navigation"

export default function HamburgerMenu({ open }: { open: boolean }) {
  const pathname = usePathname()
  const isHome = pathname === "/home"
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`h-1 w-6 origin-top-left rounded transition-all duration-200 ease-in-out ${
          isHome ? "bg-primary-foreground" : "bg-foreground"
        } ${open ? "rotate-45" : ""}`}
      />
      <div
        className={`h-1 w-6 origin-center rounded transition-transform duration-200 ease-in-out ${
          isHome ? "bg-primary-foreground" : "bg-foreground"
        } ${open ? "max-w-0" : ""}`}
      />
      <div
        className={`h-1 w-6 origin-bottom-left rounded transition-all duration-200 ease-in-out ${
          isHome ? "bg-primary-foreground" : "bg-foreground"
        } ${open ? "-rotate-45" : ""}`}
      />
    </div>
  )
}
