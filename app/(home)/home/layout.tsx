import RaffleDialog from "@/app/components/raffle/RaffleDialog";

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RaffleDialog />
      {children}
    </>
  );
}
