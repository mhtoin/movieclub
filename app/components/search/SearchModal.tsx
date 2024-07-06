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
      <DialogContent
        className="bg-transparent no-scrollbar h-[90vh] max-h-[90vh]"
        variant="noClose"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
