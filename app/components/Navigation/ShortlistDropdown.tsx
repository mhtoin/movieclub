import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/Button";

export const ShortlistDropdown = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <Button variant="ghost">Shortlist</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={5}
        className="bg-zinc-800/90 p-5 flex flex-col gap-2 border border-neutral-700 backdrop-blur-sm text-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
      >
        <DropdownMenu.Item>All</DropdownMenu.Item>
        <DropdownMenu.Group className="pl-2">
          <DropdownMenu.Item>Search</DropdownMenu.Item>
          <DropdownMenu.Item>Watchlist</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);
