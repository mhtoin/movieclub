"use client";
import { usePathname, useRouter } from "next/navigation";
import AriaDialog from "../ui/AriaDialog";
import Search from "./Search";

export default function SearchModal() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <AriaDialog title="Search" onClose={() => router.back()}>
      <Search />
    </AriaDialog>
  );
}
