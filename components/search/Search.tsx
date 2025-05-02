import { Suspense } from 'react'
import FilterBar from './FilterBar'
import Results from './Results'

export default function Search() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-2 rounded-lg">
      <Suspense fallback={<div>Loading...</div>}>
        <FilterBar />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Results />
      </Suspense>
    </div>
  )
}
