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
import { useRouter } from "next/navigation";

export default function SearchDrawer() {
  const router = useRouter();
  return (
    <Drawer
      open={true}
      setBackgroundColorOnScale={false}
      shouldScaleBackground={true}
    >
      <DrawerContent>
        <Search />
      </DrawerContent>
    </Drawer>
  );
}
