"use client";
import dynamic from "next/dynamic";

const RaffleDialog = dynamic(
  () => import("@/app/components/raffle/RaffleDialog"),
  {
    ssr: true,
  }
);

export default function Raffle() {
  return <RaffleDialog />;
}
