import { Button } from "@/app/components/ui/Button";
import { ArrowUpDown, Filter } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/Drawer";
import { Checkbox } from "../ui/Checkbox";
import RangeSlider from "../ui/RangeSlider";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";
import { RadioGroup, RadioProvider } from "@ariakit/react";
import Radio from "../ui/Radio";

export default function SortDrawer() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort_by");
  const sortBy = sort ? sort.split(".")[0] : "popularity";
  const [selectedValue, setSelectedValue] = useState(sortBy);
  const [selectedDirection, setSelectedDirection] = useState(
    sort ? sort.split(".")[1] : "desc"
  );
  const pathname = usePathname();
  const router = useRouter();

  const handleDirectionChange = (direction: string) => {
    setSelectedDirection(direction);
  };

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
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sort</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex flex-col h-full gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium mb-2">Direction</h3>
            <div className="flex flex-col gap-2">
              <Radio
                values={["Ascending", "Descending"]}
                onChange={handleSortChange}
              />
            </div>
            <h3 className="text-sm font-medium mb-2">Sort by</h3>
            <div className="flex flex-col gap-2">
              <Radio
                values={Object.values(SORT_OPTIONS).map(
                  (option) => option.label
                )}
                onChange={handleSortChange}
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
