export default function ItemSkeleton() {
  return (
    <div className="moviecard border-border/50 bg-card items-center justify-center rounded-none first:rounded-l-md last:rounded-r-md md:rounded-md md:border">
      <div className="flex h-full flex-col items-center justify-center space-y-5">
        <div className="bg-accent/40 h-10 w-10 rounded-full" />
        <div className="flex flex-col justify-center space-y-3">
          <div className="bg-accent/40 m-auto h-1 w-10 rounded-md" />
          <div className="bg-accent/40 h-1 w-12 rounded-md" />
        </div>
      </div>
    </div>
  )
}
