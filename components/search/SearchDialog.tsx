import { useRouter } from "next/navigation"
import AriaDialog from "../ui/AriaDialog"
import FilterBar from "./FilterBar"
import Results from "./Results"

import { useDialogStore } from "@/stores/useDialogStore"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchDialog() {
  const router = useRouter()
  const pathname = usePathname()
  const { initialRoute } = useDialogStore()
  const [open, setOpen] = useState(true)
  useEffect(() => {
    if (pathname === "/search") {
      setOpen(true)
    }
  }, [pathname])
  return (
    <AriaDialog
      title="Search"
      open={open}
      onClose={() => {
        if (initialRoute) {
          setOpen(false)
          router.push(initialRoute)
        } else {
          setOpen(false)
          router.back()
        }
      }}
    >
      <div className="relative flex h-full flex-col items-center justify-center gap-2 rounded-lg">
        <div className="bg-background sticky top-0 z-40 w-full pb-2">
          <FilterBar />
        </div>

        <Results />
      </div>
    </AriaDialog>
  )
}
