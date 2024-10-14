import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";

export default function UserPortrait({ user }: { user: User }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Image
            src={user?.image}
            alt={user?.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
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
