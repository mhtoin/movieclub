import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { cn } from "@/lib/utils";

export default function UserPortrait({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Image
            src={user?.image}
            alt={user?.name}
            width={40}
            height={40}
            className={cn("rounded-full object-cover", className)}
          />
        </TooltipTrigger>
        <TooltipContent className="bg-card">
          <div className="flex flex-col">
            <span className="font-bold">{user?.name}</span>
            <span className="text-foreground/50">{user?.email}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
