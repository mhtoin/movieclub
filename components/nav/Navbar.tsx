"use client"
import { useIsMobile } from "@/lib/hooks"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { Suspense, useEffect } from "react"
import { useState } from "react"
import SearchButton from "../search/SearchButton"
import Menubar from "./Menubar"
import ProfileMenu from "./ProfileMenu"

const ThemeSwitcher = dynamic(() => import("../theme/ThemeSwitcher"), {
  ssr: false,
})

export default function NavBar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isTransparent, setIsTransparent] = useState(false)

  useEffect(() => {
    if (pathname === "/home" || pathname.startsWith("/movie/")) {
      setIsTransparent(true)
    } else {
      setIsTransparent(false)
    }
  }, [pathname])

  const isHome = pathname === "/home"

  if (isMobile) {
    return (
      <div
        className={`fixed top-0 z-100 flex h-[70px] min-h-[70px] w-screen min-w-screen items-center justify-center p-2 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-background/80 border-b backdrop-blur-md"
        }`}
      >
        <div className="flex w-full items-center justify-between rounded px-1 py-5">
          <div className="flex items-center justify-center gap-2">
            <ProfileMenu />
            <span
              className={`font-bold ${isHome ? "text-primary-foreground" : "text-foreground"}`}
            >
              leffaseura
            </span>
          </div>
          <div className="relative flex h-full items-center gap-2">
            <ThemeSwitcher />
            <SearchButton />
            <Menubar />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div
      className={`fixed top-0 z-100 flex h-[70px] min-h-[70px] w-screen min-w-screen items-center justify-center p-2 transition-all duration-300 ${
        isTransparent ? "bg-transparent" : "bg-base backdrop-blur-md"
      }`}
    >
      <div className="hidden h-[70px] min-h-[70px] w-[90%] items-center justify-between rounded p-5 sm:flex">
        {/**Right side */}
        <div className="flex items-center justify-center gap-5 lg:gap-10">
          {<Menubar />}
          <span
            className={`siteTitle text-xl font-bold lg:text-2xl ${isHome ? "text-primary-foreground" : "text-foreground"}`}
          >
            leffaseura
          </span>
        </div>
        <div className="flex h-full items-center gap-10">
          <Suspense fallback={null}>
            <SearchButton />
          </Suspense>
          <ThemeSwitcher />
          <Suspense fallback={null}>
            <ProfileMenu />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
