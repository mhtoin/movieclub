export default function ItemSkeleton() {
  return (
    <div className="moviecard items-center justify-center md:border border-border/50 bg-card rounded-none first:rounded-l-md last:rounded-r-md md:rounded-md">
      <div className="flex flex-col items-center justify-center h-full space-y-5 ">
        <div className="w-10 h-10 bg-accent/40 rounded-full " />
        <div className="flex flex-col space-y-3 justify-center">
          <div className="h-1 w-10 bg-accent/40 rounded-md m-auto" />
          <div className="w-12 h-1 bg-accent/40 rounded-md" />
        </div>
      </div>
    </div>
  )
}
