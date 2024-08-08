import { useState } from "react";
import {
  Select,
  SelectArrow,
  SelectItem,
  SelectItemCheck,
  SelectLabel,
  SelectPopover,
  SelectProvider,
  useSelectStore,
} from "@ariakit/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/lib/constants";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/Button";

export default function SortMenu() {
  const store = useSelectStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort_by");
  const sortBy = sort ? sort.split(".")[0] : "popularity";
  const [selectedValue, setSelectedValue] = useState(sortBy);
  const [selectedDirection, setSelectedDirection] = useState(
    sort ? sort.split(".")[1] : "desc"
  );
  const isOpen = store.useState("open");

  const handleSortChange = (value?: string, direction?: string) => {
    if (value) {
      setSelectedValue(value);
    }
    if (direction) {
      setSelectedDirection(direction);
    }
    const params = new URLSearchParams(searchParams);
    params.set("sort_by", `${value}.${direction}`);
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col gap-1 p-1">
      <SelectProvider
        value={selectedValue}
        setValue={(value) => {
          handleSortChange(value.toString(), selectedDirection);
        }}
        store={store}
      >
        <SelectLabel hidden>Sort by</SelectLabel>
        <Select
          store={store}
          className={cn(
            "flex flex-none h-10 select-none items-center gap-1 whitespace-nowrap rounded-lg border pl-4 pr-4 text-[1rem] leading-6 [text-decoration-line:none] outline-[2px] outline-offset-[2px] [box-shadow:inset_0_0_0_1px_var(--border),_inset_0_2px_0_var(--highlight),_inset_0_-1px_0_var(--shadow),_0_1px_1px_var(--shadow)] justify-between",
            "border-accent text-secondary-foreground"
          )}
        >
          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm font-medium text-foreground">
              {SORT_OPTIONS[selectedValue as keyof typeof SORT_OPTIONS].label}
            </p>
            {selectedDirection === "desc" ? (
              <ArrowDown className="w-4 h-4 text-foreground" />
            ) : (
              <ArrowUp className="w-4 h-4 text-foreground" />
            )}
          </div>
          <SelectArrow
            store={store}
            className={`transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Select>
        <SelectPopover
          store={store}
          gutter={4}
          sameWidth
          unmountOnHide
          className="popover bg-popover w-[200px] z-50 max-h-[min(var(--popover-available-height, 300px), 300px)] flex flex-col gap-2 justify-center items-center overscroll-contain rounded-lg border border-solid p-2 overflow-auto text-[white] [box-shadow:0_10px_15px_-3px_rgb(0_0_0_/_0.25),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)]"
        >
          <div className="flex flex-row gap-2">
            <Button
              variant={selectedDirection === "desc" ? "secondary" : "ghost"}
              size={"icon"}
              onClick={() => handleSortChange(selectedValue, "desc")}
            >
              <ArrowDown className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              variant={selectedDirection === "asc" ? "secondary" : "ghost"}
              size={"icon"}
              onClick={() => handleSortChange(selectedValue, "asc")}
            >
              <ArrowUp className="w-4 h-4 text-foreground" />
            </Button>
          </div>
          <div className="grid grid-cols-1">
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <SelectItem
                key={option.value}
                value={key}
                store={store}
                className="flex cursor-default items-center gap-2 rounded p-2 !outline-[none] text-foreground hover:bg-accent/80 hover:text-accent-foreground"
              >
                <SelectItemCheck />
                {option.label}
              </SelectItem>
            ))}
          </div>
        </SelectPopover>
      </SelectProvider>
    </div>
  );
}
