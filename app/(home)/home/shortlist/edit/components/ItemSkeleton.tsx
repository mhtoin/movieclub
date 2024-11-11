export default function ItemSkeleton({
  skeletonCount,
  index,
}: {
  skeletonCount: number;
  index: number;
}) {
  return (
    <div className={`moviecard items-center justify-center border`}>
      <div className="flex flex-col items-center justify-center h-full space-y-5 ">
        <div className="w-10 h-10 bg-gray-300 rounded-full "></div>
        <div className="flex flex-col space-y-3 justify-center">
          <div className="h-1 w-10 bg-gray-300 rounded-md m-auto"></div>
          <div className="w-12 h-1 bg-gray-300 rounded-md "></div>
        </div>
      </div>
    </div>
  );
}
