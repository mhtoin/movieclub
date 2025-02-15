import { X } from "lucide-react";
import { Button } from "../ui/Button";

export default function KeywordTag({
  keyword,
  handleClick,
}: {
  keyword: { id: number; name: string };
  handleClick: (keyword: { id: number; name: string }) => void;
}) {
  return (
    <div className="overflow-visible h-6 px-2 py-2 text-xxs relative group/badge border bg-background inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium">
      <span>{keyword?.name}</span>
      <Button
        variant={"outline"}
        size={"xs"}
        className="z-10 w-4 h-4 absolute -top-2 -right-2 p-0 hidden group-hover/badge:flex overflow-visible"
        key={keyword?.id}
        onClick={() => handleClick(keyword)}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
