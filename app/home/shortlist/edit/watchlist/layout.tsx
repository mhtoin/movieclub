"use client";
export default function SearchLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center mb-5">
      <div className="divider m-10">
        <div className="text-xl">Watchlist</div>
      </div>
      {children}
    </div>
  );
}
