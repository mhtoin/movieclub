import { Button } from "@/app/components/ui/Button";
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
import Search from "./Search";
import { usePathname, useRouter } from "next/navigation";
import { useDialogStore } from "@/stores/useDialogStore";
import { useEffect, useState } from "react";
import { SEARCH_ROUTE } from "@/lib/globals";

export default function SearchDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { initialRoute } = useDialogStore();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (pathname === `/search`) {
      setOpen(true);
    }
  }, [pathname]);
  return (
    <Drawer
      open={open}
      setBackgroundColorOnScale={false}
      shouldScaleBackground={true}
      onOpenChange={() => {
        if (initialRoute) {
          setOpen(false);
          router.push(initialRoute);
        } else {
          setOpen(false);
          router.back();
        }
      }}
    >
      <DrawerContent>
        <Search />
      </DrawerContent>
    </Drawer>
  );
}
