"use client";
import Search from "@/app/components/search/Search";
import SearchModal from "@/app/components/search/SearchModal";
import AriaDialog from "@/app/components/ui/AriaDialog";
import { usePathname, useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <AriaDialog title="Search" onClose={() => router.back()}>
      <Search />
    </AriaDialog>
    /*<SearchModal>
      <Search />
    </SearchModal>*/
  );
}
