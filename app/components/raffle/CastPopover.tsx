import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { Button } from "../ui/Button";
import { List } from "lucide-react";
import CastPortrait from "./CastPortrait";

export default function CastPopover({ cast }: { cast: Array<Cast> }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="p-0">
          <List />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
        <div className="flex flex-row flex-wrap gap-5">
          {cast.map((c) => (
            <CastPortrait cast={c} key={c.id} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
