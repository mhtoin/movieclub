export default function ItemSkeleton() {
  return (
    <div className="mx-auto border rounded-md w-[90px] h-[110px] md:h-[130px] 2xl:w-[130px] 2xl:h-[180px]">
      <div className="flex flex-col items-center justify-center h-full space-y-5 animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-full "></div>
        <div className="flex flex-col space-y-3 justify-center">
          <div className="h-1 w-10 bg-gray-300 rounded-md m-auto"></div>
          <div className="w-12 h-1 bg-gray-300 rounded-md "></div>
        </div>
      </div>
    </div>
  );
}
