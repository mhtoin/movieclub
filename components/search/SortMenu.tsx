"use client"

import { SORT_OPTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectArrow,
  SelectItem,
  SelectItemCheck,
  SelectLabel,
  SelectPopover,
  SelectProvider,
  useSelectStore,
  useStoreState,
} from "@ariakit/react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "../ui/Button"

export default function SortMenu() {
  const store = useSelectStore()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sort = searchParams.get("sort_by")
  const sortBy = sort ? sort.split(".")[0] : "popularity"
  const [selectedValue, setSelectedValue] = useState(sortBy)
  const [selectedDirection, setSelectedDirection] = useState(
    sort ? sort.split(".")[1] : "desc",
  )
  const isOpen = useStoreState(store).open

  const handleSortChange = (value?: string, direction?: string) => {
    if (value) {
      setSelectedValue(value)
    }
    if (direction) {
      setSelectedDirection(direction)
    }
    const params = new URLSearchParams(searchParams)
    params.set("sort_by", `${value}.${direction}`)
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  return (
    <div className="flex flex-col gap-1 p-1">
      <SelectProvider
        value={selectedValue}
        setValue={(value) => {
          handleSortChange(value.toString(), selectedDirection)
        }}
        store={store}
      >
        <SelectLabel hidden>Sort by</SelectLabel>
        <Select
          store={store}
          className={cn(
            "flex h-10 flex-none items-center justify-between gap-1 rounded-lg border pr-4 pl-4 text-[1rem] leading-6 whitespace-nowrap [text-decoration-line:none] [box-shadow:inset_0_0_0_1px_var(--border),_inset_0_2px_0_var(--highlight),_inset_0_-1px_0_var(--shadow),_0_1px_1px_var(--shadow)] outline-[2px] outline-offset-[2px] select-none",
            "border-accent/80 text-secondary-foreground",
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <p className="text-foreground text-sm font-medium">
              {SORT_OPTIONS[selectedValue as keyof typeof SORT_OPTIONS]?.label}
            </p>
            {selectedDirection === "desc" ? (
              <ArrowDown className="text-foreground h-4 w-4" />
            ) : (
              <ArrowUp className="text-foreground h-4 w-4" />
            )}
          </div>
          <SelectArrow
            store={store}
            className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </Select>
        <SelectPopover
          store={store}
          gutter={4}
          sameWidth
          unmountOnHide
          className="popover bg-popover max-h-[min(var(--popover-available-height, 300px), 300px)] z-50 flex w-[200px] flex-col items-center justify-center gap-2 overflow-auto overscroll-contain rounded-lg border border-solid p-2 text-[white] [box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.25),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]"
        >
          <div className="flex flex-row gap-2">
            <Button
              variant={selectedDirection === "desc" ? "secondary" : "ghost"}
              size={"icon"}
              onClick={() => handleSortChange(selectedValue, "desc")}
            >
              <ArrowDown className="text-foreground h-4 w-4" />
            </Button>
            <Button
              variant={selectedDirection === "asc" ? "secondary" : "ghost"}
              size={"icon"}
              onClick={() => handleSortChange(selectedValue, "asc")}
            >
              <ArrowUp className="text-foreground h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1">
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <SelectItem
                key={option.value}
                value={key}
                store={store}
                className="text-foreground hover:bg-accent/80 hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded p-2 outline-[none]!"
              >
                <SelectItemCheck />
                {option.label}
              </SelectItem>
            ))}
          </div>
        </SelectPopover>
      </SelectProvider>
    </div>
  )
}
