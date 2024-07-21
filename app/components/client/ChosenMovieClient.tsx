"use client";
import { useChosenMovieListener } from "@/lib/hooks/useChosenMovieListener";

export default function ChosenMovieClient() {
  useChosenMovieListener();
  return <div></div>;
}
