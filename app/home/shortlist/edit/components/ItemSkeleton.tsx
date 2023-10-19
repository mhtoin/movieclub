export default function ItemSkeleton() {
  return (
    <div className="mx-auto border-2 rounded-md w-[150px] h-[230px]">
      <div className="flex flex-col items-center justify-center h-full space-y-5 animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-full "></div>
        <div className="flex flex-col space-y-3">
          <div className="h-6 bg-gray-300 rounded-md w-30 "></div>
          <div className="w-20 h-3 bg-gray-300 rounded-md "></div>
        </div>
      </div>
    </div>
  );
}
