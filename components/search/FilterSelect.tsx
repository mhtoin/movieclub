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
import { useSearchParams } from "next/navigation"
import { useState } from "react"

interface SelectProps {
  label: string
  options?: { label: string; value: number }[]
  onChange: (value: string[]) => void
}

export default function FilterSelect({
  label,
  options,
  onChange,
}: SelectProps) {
  const store = useSelectStore()
  const searchParams = useSearchParams()
  const selectedGenres = searchParams.get("with_genres")?.split(",") ?? []
  const [value, setValue] = useState<string[]>(selectedGenres)
  const isOpen = useStoreState(store).open

  return (
    <div className="flex flex-col gap-1 p-1">
      <SelectProvider
        value={value}
        setValue={(value) => {
          setValue([...value])
          onChange([...value])
        }}
        store={store}
      >
        <SelectLabel hidden>{label}</SelectLabel>
        <Select
          store={store}
          className={cn(
            "bg-input flex h-10 flex-none items-center justify-between gap-1 rounded-lg border pr-4 pl-4 text-[1rem] leading-6 whitespace-nowrap [text-decoration-line:none] [box-shadow:inset_0_0_0_1px_var(--border),_inset_0_2px_0_var(--highlight),_inset_0_-1px_0_var(--shadow),_0_1px_1px_var(--shadow)] outline-[2px] outline-offset-[2px] select-none",
            "border-border/80 text-foreground",
          )}
        >
          <div className="relative overflow-visible">
            {value.length > 0 ? (
              <div className="group flex items-center">
                <div className="max-w-[160px] truncate pl-2 transition-all duration-300 group-hover:max-w-[270px]">
                  <span className="whitespace-nowrap">
                    {options
                      ?.filter((opt) => value.includes(opt?.value?.toString()))
                      .map((opt) => opt?.label)
                      .join(", ")}
                  </span>
                </div>
                {value.length > 3 && (
                  <span className="ml-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    (+{value.length - 3})
                  </span>
                )}
              </div>
            ) : (
              label
            )}
            {value.length > 0 && (
              <span className="bg-accent text-accent-foreground absolute -top-2 -left-2 flex h-4 w-4 items-center justify-center rounded-full text-xs">
                {value.length}
              </span>
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
          className="popover bg-popover z-50 flex max-h-[var(--popover-available-height,300px)] w-[300px] flex-col items-center justify-center gap-2 overflow-auto overscroll-contain rounded-lg border border-solid p-2 text-[white] [box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.25),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]"
        >
          <div className="grid min-h-[48px] grid-cols-2 justify-between justify-items-stretch">
            {options?.map((option) => (
              <SelectItem
                key={option.value}
                value={option?.value?.toString()}
                store={store}
                className="text-foreground hover:bg-accent/80 hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded p-2 outline-[none]!"
              >
                <SelectItemCheck />
                {option?.label}
              </SelectItem>
            ))}
          </div>
        </SelectPopover>
      </SelectProvider>
    </div>
  )
}
