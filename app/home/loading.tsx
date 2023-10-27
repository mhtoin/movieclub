import { CardSkeleton } from "./components/CardSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-normal p-10 gap-10">
      <div className="flex flex-col justify-center place-items-center gap-5">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Movie Club
        </h1>
        <div className="flex flex-row items-center bg-transparent rounded-md justify-between max-w-[300px] group relative"></div>
      </div>
      <CardSkeleton />
    </div>
  );
}
