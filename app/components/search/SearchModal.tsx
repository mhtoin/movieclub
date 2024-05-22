"use client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../ui/Dialog";

export default function SearchModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="w-2/3 bg-transparent overflow-scroll no-scrollbar">
        {children}
      </DialogContent>
    </Dialog>
  );
}
