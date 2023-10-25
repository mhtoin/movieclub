import { getAllMoviesOfTheWeek } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { format, getWeek } from "date-fns";
import { MovieDatePicker } from "./MovieDatePicker";

export const CalendarPopover = ({
  selected,
  setSelected,
  open,
  setOpen,
}: {
  selected: Date;
  setSelected: any;
  open: boolean;
  setOpen: any;
}) => {
  const { data } = useQuery({
    queryKey: ["movieOfTheWeek"],
    queryFn: async () => getAllMoviesOfTheWeek(),
  });

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        asChild
        className="rounded-md w-[35px] h-[35px] m-2 inline-flex items-center justify-center text-violet11 bg-white shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default outline-none"
        aria-label="Update dimensions"
      >
        <MovieDatePicker selected={selected} setSelected={setSelected}/>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          className="rounded p-5 w-[400px] text-black bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
            <MovieDatePicker selected={selected} setSelected={setSelected}/>
          
          <Popover.Close />
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
