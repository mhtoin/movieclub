export default function Stats({ chartData }: { chartData: UserChartData }) {
    const totalPicked = chartData?.data?.reduce((prev, curr) => {
        return prev + curr.movies
    }, 0)
    
  return (
    <div className="stats stats-vertical bg-slate-900 text-primary-content md:stats-horizontal shadow">
      {chartData?.data?.map((item) => {
        const percentage = (item.movies / totalPicked) * 100
        return (
          <div key={item.user} className="stat">
            <div className="stat-title">{item.user}</div>
            <div className="stat-value">{percentage.toFixed(2) + '%'}</div>
            <div className="stat-desc">Pick-rate</div>
          </div>
        );
      })}
    </div>
  );
}
